'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { claimAudio, onAudioClaimed } from '@/lib/synth'
import type { Track } from './site-content'
import { CheckoutLogo, Icon } from './shared'

/**
 * 底部播放器（全站共用：換頁時音樂不會中斷）
 * 聲音圖書館點播放時，就是交給這裡播。
 */


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
   右下角播放卡（深灰玻璃，跟聲音卡片做出區別）
   ================================================================ */

const sleepOptions = [null, 15, 30, 60] as const

/** 播放卡左邊的小封面：有照片用照片，沒有就用 Checkout. Logo */
function PlayerCover({ track }: { track: Track }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[#1c1d22] text-[#e6efeecc] sm:size-16">
      {track.cover && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- 使用者上傳的圖片，尺寸不固定
        <img src={track.cover} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <CheckoutLogo size="xs" />
      )}
    </div>
  )
}

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
      {/* 墊高頁面底部，避免播放卡蓋住 Footer */}
      <div aria-hidden="true" className="h-40" />
      <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 sm:inset-x-auto sm:right-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:w-[420px]">
        <div className="glass-player relative rounded-[26px] px-4 pt-4 pb-3.5 sm:px-5 sm:pt-5 sm:pb-4">
          {/* 關閉 */}
          <button
            onClick={player.close}
            className="player-close absolute -top-2 -right-2 size-7"
            aria-label="關閉播放器"
          >
            <Icon name="close" className="size-3" />
          </button>

          <div className="flex items-center gap-4">
            <PlayerCover key={track.id} track={track} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-[700]">{track.title}</p>
              <p className="mt-1 truncate text-sm font-[600] text-[#e6efee80]">
                {error ? <span className="text-[#ff9ad5]">{error}</span> : track.creatorName}
              </p>
            </div>

            {/* 睡眠計時 */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSleepOpen((v) => !v)}
                className={`flex h-11 min-w-11 items-center justify-center gap-1 rounded-full px-2 transition-colors hover:bg-[#ffffff0d] ${
                  sleepLeft ? 'text-[#a084ff]' : 'text-[#e6efee80] hover:text-[#e6efeecc]'
                }`}
                aria-label="睡眠計時"
                aria-expanded={sleepOpen}
              >
                <Icon name="clock" className="size-6" />
                {sleepLeft && <span className="text-xs font-[500] tabular-nums">{sleepLeft}分</span>}
              </button>
              {sleepOpen && (
                <div className="glass-player absolute right-0 bottom-full mb-3 w-44 rounded-2xl p-2">
                  <p className="px-3 pt-2 pb-1 text-[11px] font-[400] tracking-[0.2em] text-[#e6efee66]">睡眠計時</p>
                  {sleepOptions.map((m) => (
                    <button
                      key={m ?? 'off'}
                      onClick={() => {
                        player.setSleep(m)
                        setSleepOpen(false)
                      }}
                      className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-[400] hover:bg-[#ffffff0d]"
                    >
                      {m ? `${m} 分鐘後停止` : '關閉'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => (playing ? player.pause() : player.resume())}
              className="glass-button size-12 shrink-0"
              aria-label={playing ? '暫停' : '播放'}
            >
              <Icon name={playing ? 'pause' : 'play'} className={`size-5 ${playing ? '' : 'translate-x-[1px]'}`} />
            </button>
          </div>

          {/* 播放進度（可拖曳） */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => player.seek(Number(e.target.value))}
            className="glass-slider mt-4 block"
            style={{ '--fill': `${progress}%` } as React.CSSProperties}
            aria-label="播放進度"
            disabled={!duration}
          />
        </div>
      </div>
    </>
  )
}
