'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { claimAudio, onAudioClaimed } from '@/lib/synth'
import type { Track } from '../../content'
import { Icon } from '../ui/Icon'
import { MiniWave } from '../ui/MiniWave'

/* ================================================================
   播放邏輯（給整個頁面共用）
   ================================================================ */

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [track, setTrack] = useState<Track | null>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState('')
  const [sleepEndsAt, setSleepEndsAt] = useState<number | null>(null)
  const sleepTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio
    const onTime = () => setTime(audio.currentTime)
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => {
      setPlaying(false)
      setError('這段聲音暫時無法播放')
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onPause)
    audio.addEventListener('error', onError)
    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onPause)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const pause = useCallback(() => audioRef.current?.pause(), [])

  // 聲音實驗室開始播時，自動暫停這裡
  useEffect(() => onAudioClaimed('library', pause), [pause])

  const resume = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    claimAudio('library')
    setError('')
    audio.play().catch(() => {
      setPlaying(false)
      setError('瀏覽器擋住了播放，請再按一次播放鍵')
    })
  }, [])

  const toggle = useCallback(
    (next: Track) => {
      const audio = audioRef.current
      if (!audio) return
      if (track?.id === next.id) {
        if (audio.paused) resume()
        else audio.pause()
        return
      }
      setTrack(next)
      setTime(0)
      setDuration(0)
      audio.src = next.url
      resume()
    },
    [track, resume],
  )

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (audio) audio.currentTime = seconds
  }, [])

  const close = useCallback(() => {
    audioRef.current?.pause()
    setTrack(null)
    setSleep(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* 睡眠計時：時間到時慢慢降低音量再停止（iPhone 不允許網頁調音量，會直接停止） */
  const setSleep = useCallback((minutes: number | null) => {
    window.clearTimeout(sleepTimer.current)
    if (!minutes) {
      setSleepEndsAt(null)
      return
    }
    const ms = minutes * 60_000
    setSleepEndsAt(Date.now() + ms)
    sleepTimer.current = window.setTimeout(() => {
      const audio = audioRef.current
      if (!audio) return
      const startVolume = audio.volume
      let step = 0
      const fade = window.setInterval(() => {
        step++
        audio.volume = Math.max(0, startVolume * (1 - step / 40))
        if (step >= 40) {
          window.clearInterval(fade)
          audio.pause()
          audio.volume = startVolume
          setSleepEndsAt(null)
        }
      }, 200)
    }, ms)
  }, [])

  /* 鎖定畫面／耳機按鍵控制 */
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.creatorName,
      album: 'Checkout. ASMR',
      artwork: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
    })
    navigator.mediaSession.setActionHandler('play', resume)
    navigator.mediaSession.setActionHandler('pause', pause)
    navigator.mediaSession.setActionHandler('seekto', (d) => d.seekTime != null && seek(d.seekTime))
    navigator.mediaSession.setActionHandler('seekbackward', () => seek(Math.max(0, (audioRef.current?.currentTime ?? 0) - 10)))
    navigator.mediaSession.setActionHandler('seekforward', () => seek((audioRef.current?.currentTime ?? 0) + 10))
  }, [track, resume, pause, seek])

  useEffect(() => {
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
  }, [playing])

  return { track, playing, time, duration, error, sleepEndsAt, toggle, resume, pause, seek, close, setSleep }
}

export type AudioPlayer = ReturnType<typeof useAudioPlayer>

/* 放在 layout 裡，讓換頁時音樂不會中斷 */
const PlayerContext = createContext<AudioPlayer | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const player = useAudioPlayer()
  return (
    <PlayerContext.Provider value={player}>
      {children}
      <PlayerBar player={player} />
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const player = useContext(PlayerContext)
  if (!player) throw new Error('usePlayer 必須在 PlayerProvider 裡使用')
  return player
}

/* ================================================================
   底部播放列
   ================================================================ */

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s <= 0) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

const sleepOptions = [null, 15, 30, 60] as const

export function PlayerBar({ player }: { player: AudioPlayer }) {
  const { track, playing, time, duration, error, sleepEndsAt } = player
  const [sleepOpen, setSleepOpen] = useState(false)
  const [, force] = useState(0)

  // 讓睡眠倒數每 30 秒更新一次
  useEffect(() => {
    if (!sleepEndsAt) return
    const id = window.setInterval(() => force((n) => n + 1), 30_000)
    return () => window.clearInterval(id)
  }, [sleepEndsAt])

  if (!track) return null
  const progress = duration ? (time / duration) * 100 : 0
  const sleepLeft = sleepEndsAt ? Math.max(1, Math.round((sleepEndsAt - Date.now()) / 60_000)) : null

  return (
    <>
    {/* 墊高頁面底部，避免播放列蓋住 Footer */}
    <div aria-hidden="true" className="h-28" />
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-deep/80 shadow-[0_20px_80px_-20px_rgb(0_0_0/0.8)] backdrop-blur-2xl">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => player.seek(Number(e.target.value))}
          className="slider -mb-2 block px-4 pt-1"
          style={{ '--fill': `${progress}%` } as React.CSSProperties}
          aria-label="播放進度"
          disabled={!duration}
        />
        <div className="flex items-center gap-3 px-3 pt-1 pb-3 sm:gap-4 sm:px-4">
          <button
            onClick={() => (playing ? player.pause() : player.resume())}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-aurora-mint to-aurora-cyan text-night"
            aria-label={playing ? '暫停' : '播放'}
          >
            <Icon name={playing ? 'pause' : 'play'} className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{track.title}</p>
            <p className="truncate text-xs text-mist/50">
              {error ? <span className="text-aurora-rose">{error}</span> : `${track.creatorName} · ${fmt(time)} / ${fmt(duration)}`}
            </p>
          </div>
          <MiniWave active={playing} className="hidden text-aurora-mint/70 sm:flex" />

          <div className="relative">
            <button
              onClick={() => setSleepOpen((v) => !v)}
              className={`flex h-10 items-center gap-1.5 rounded-full px-3 text-xs transition-colors hover:bg-white/5 ${
                sleepLeft ? 'text-aurora-violet' : 'text-mist/55'
              }`}
              aria-label="睡眠計時"
              aria-expanded={sleepOpen}
            >
              <Icon name="moon" className="size-[18px]" />
              {sleepLeft && <span className="tabular-nums">{sleepLeft}分</span>}
            </button>
            {sleepOpen && (
              <div className="absolute right-0 bottom-12 w-44 rounded-2xl border border-white/10 bg-deep/95 p-2 shadow-2xl backdrop-blur-xl">
                <p className="px-3 pt-2 pb-1 text-[11px] tracking-[0.2em] text-mist/40">睡眠計時</p>
                {sleepOptions.map((m) => (
                  <button
                    key={m ?? 'off'}
                    onClick={() => {
                      player.setSleep(m)
                      setSleepOpen(false)
                    }}
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/5"
                  >
                    {m ? `${m} 分鐘後停止` : '關閉'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={player.close}
            className="grid size-10 shrink-0 place-items-center rounded-full text-mist/45 hover:bg-white/5 hover:text-mist"
            aria-label="關閉播放器"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
