'use client'

import { useCallback, useEffect, useMemo, useState, useRef, createContext, useContext } from 'react'
import { FILTER_EVENT, listen } from '@/lib/events'
import { categoryLabels, type Track } from './site-content'
import { Icon, MiniWave, Section, SectionHeading } from './shared'
import { claimAudio, onAudioClaimed } from '@/lib/synth'

/**
 * 聲音圖書館：音檔列表、投稿上傳視窗、底部播放器
 */

// ─────────────── 聲音圖書館 Library ───────────────

const LIKES_KEY = 'checkout:liked'

/** 感官體驗 ▸ 聲音資料庫 */
export function Library({ tracks: allTracks }: { tracks: Track[] }) {
  const player = usePlayer()
  const tracks = useMemo(() => allTracks.filter((t) => t.url), [allTracks])
  const [filter, setFilter] = useState<string>('all')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const categories = useMemo(() => {
    const used = new Set(tracks.map((t) => t.category))
    return Object.keys(categoryLabels).filter((c) => used.has(c))
  }, [tracks])

  const visible = filter === 'all' ? tracks : tracks.filter((t) => t.category === filter)

  /* 收藏存在這台裝置上 */
  useEffect(() => {
    try {
      setLiked(new Set(JSON.parse(localStorage.getItem(LIKES_KEY) ?? '[]') as string[]))
    } catch {
      /* ignore */
    }
  }, [])

  /* 測驗結果要求篩選某個類型 */
  useEffect(
    () => listen(FILTER_EVENT, (cat) => setFilter(tracks.some((t) => t.category === cat) ? cat : 'all')),
    [tracks],
  )

  /* 從分享連結（?track=xx）進來時，捲到那首並標示出來 */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('track')
    if (!id) return
    setHighlightId(id)
    window.setTimeout(() => {
      document.getElementById(`track-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 700)
  }, [])

  const showToast = useCallback((text: string) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2200)
  }, [])

  function toggleLike(id: string) {
    setLiked((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(LIKES_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  async function shareTrack(track: Track) {
    const url = new URL('/experience', window.location.origin)
    url.searchParams.set('track', track.id)
    url.hash = 'library'
    const data = {
      title: `${track.title} — Checkout.`,
      text: `來聽 ${track.creatorName} 的 ASMR：${track.title}`,
      url: url.toString(),
    }
    try {
      if (navigator.share) await navigator.share(data)
      else {
        await navigator.clipboard.writeText(data.url)
        showToast('連結已複製')
      }
    } catch {
      /* 使用者取消分享 */
    }
  }

  const closeUpload = useCallback(() => setUploadOpen(false), [])

  return (
    <Section id="library">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <SectionHeading
          index="03"
          kicker="Sound library"
          title={
            <>
              選一個聲音，
              <br />
              慢慢待著
            </>
          }
          lead="來自不同角落、不同人的 ASMR。每段聲音都經過審核才會公開。"
        />
        <button onClick={() => setUploadOpen(true)} className="btn-ghost reveal w-fit shrink-0">
          <Icon name="upload" className="size-4" /> 分享你的聲音
        </button>
      </div>

      {tracks.length > 0 && categories.length > 1 && (
        <div className="-mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <button className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            全部 · {tracks.length}
          </button>
          {categories.map((c) => (
            <button key={c} className="chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
              {categoryLabels[c]}
            </button>
          ))}
        </div>
      )}

      {tracks.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((track) => {
            const active = player.track?.id === track.id
            const playing = active && player.playing
            const isLiked = liked.has(track.id)
            return (
              <li
                key={track.id}
                id={`track-${track.id}`}
                className={`glass group relative flex flex-col overflow-hidden rounded-3xl p-5 transition-all duration-700 sm:p-6 ${
                  active ? 'border-aurora-mint/40 shadow-[0_0_60px_-15px_rgb(111_245_200/0.5)]' : ''
                } ${highlightId === track.id ? 'ring-2 ring-aurora-mint/60' : ''}`}
              >
                <div className="flex items-center justify-between gap-3 text-xs text-mist/55">
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {categoryLabels[track.category] ?? track.category}
                  </span>
                  {track.origin && (
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <Icon name="pin" className="size-3.5 shrink-0" />
                      <span className="truncate">{track.origin}</span>
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={() => player.toggle(track)}
                    className={`grid size-14 shrink-0 place-items-center rounded-full transition-all duration-500 ${
                      playing
                        ? 'bg-mist text-night'
                        : 'bg-white/10 text-mist group-hover:bg-gradient-to-br group-hover:from-aurora-mint group-hover:to-aurora-cyan group-hover:text-night'
                    }`}
                    aria-label={playing ? `暫停 ${track.title}` : `播放 ${track.title}`}
                  >
                    <Icon name={playing ? 'pause' : 'play'} className="size-5" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-medium">{track.title}</h3>
                    <p className="truncate text-sm text-mist/50">{track.creatorName}</p>
                  </div>
                </div>

                {track.description && (
                  <p className="mt-5 line-clamp-2 text-sm leading-6 text-mist/55">{track.description}</p>
                )}

                <div className="mt-auto flex items-center justify-between pt-6">
                  <MiniWave active={playing} />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleLike(track.id)}
                      className={`grid size-10 place-items-center rounded-full transition-colors hover:bg-white/5 ${
                        isLiked ? 'text-aurora-rose' : 'text-mist/50'
                      }`}
                      aria-label={isLiked ? '取消收藏' : '收藏'}
                      aria-pressed={isLiked}
                    >
                      <Icon name="heart" className={`size-[18px] ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => shareTrack(track)}
                      className="grid size-10 place-items-center rounded-full text-mist/50 transition-colors hover:bg-white/5 hover:text-mist"
                      aria-label={`分享 ${track.title}`}
                    >
                      <Icon name="share" className="size-[18px]" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="glass reveal mt-14 flex flex-col items-center rounded-[2rem] border-dashed px-6 py-16 text-center sm:py-20">
          <div className="relative grid size-16 place-items-center">
            <span className="animate-ping-soft absolute inset-0 rounded-full border border-aurora-mint/40" />
            <Icon name="volume" className="size-7 text-aurora-mint" />
          </div>
          <p className="mt-8 text-2xl font-light">聲音資料庫正在收集第一批聲音</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-mist/55">
            上傳一段你錄下的 ASMR，成為第一位分享者。等待的同時，也可以先到聲音實驗室玩玩看。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => setUploadOpen(true)} className="btn-primary">
              <Icon name="upload" className="size-4" /> 上傳聲音
            </button>
            <a href="#lab" className="btn-ghost">
              前往聲音實驗室
            </a>
          </div>
        </div>
      )}

      <UploadDialog open={uploadOpen} onClose={closeUpload} />

      <div
        role="status"
        className={`fixed top-[max(1rem,env(safe-area-inset-top))] left-1/2 z-[70] -translate-x-1/2 rounded-full bg-mist px-5 py-2.5 text-sm text-night shadow-xl transition-all duration-500 ${
          toast ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        {toast}
      </div>
    </Section>
  )
}

// ─────────────── 投稿上傳視窗 UploadDialog ───────────────

// Vercel 每次請求上限約 4.5 MB；約等於 4 分鐘的 128kbps MP3
const MAX_MB = 4
const ACCEPT = 'audio/mpeg,audio/mp4,audio/x-m4a,audio/ogg,audio/wav,audio/x-wav,audio/webm'

export function UploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [fileName, setFileName] = useState('')
  const firstField = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setMessage(null)
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => firstField.current?.focus(), 200)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // 先把表單存起來：await 之後 event.currentTarget 會變成 null（原版的 bug）
    const form = event.currentTarget
    const data = new FormData(form)
    const file = data.get('audio')
    if (file instanceof File && file.size > MAX_MB * 1024 * 1024) {
      setMessage({ ok: false, text: `檔案超過 ${MAX_MB} MB，請剪短一點，或轉成 MP3 / M4A 再上傳。` })
      return
    }

    setUploading(true)
    setMessage(null)
    try {
      const response = await fetch('/submit-track', { method: 'POST', body: data })
      const result = (await response.json().catch(() => ({}))) as { message?: string }
      if (response.ok) {
        form.reset()
        setFileName('')
        setMessage({ ok: true, text: result.message ?? '上傳完成，審核通過後就會出現在資料庫。' })
      } else {
        setMessage({ ok: false, text: result.message ?? '上傳時發生問題，請稍後再試。' })
      }
    } catch {
      setMessage({ ok: false, text: '網路好像斷了，請確認連線後再試一次。' })
    } finally {
      setUploading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-night/70 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-deep/95 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[2rem] sm:p-9">
        <div className="flex items-start justify-between">
          <div>
            <p className="kicker">Contribute</p>
            <h2 id="upload-title" className="mt-3 text-3xl font-light">
              分享你的聲音
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full border border-white/15 text-mist/70 hover:text-mist"
            aria-label="關閉上傳視窗"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="field-label">作品名稱 *</span>
            <input ref={firstField} name="title" required maxLength={80} className="field-input" placeholder="例如：清晨翻書聲" />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">創作者名稱 *</span>
              <input name="creatorName" required maxLength={50} className="field-input" placeholder="你的稱呼" />
            </label>
            <label className="block">
              <span className="field-label">錄製地點</span>
              <input name="origin" maxLength={40} className="field-input" placeholder="例如：台灣・台北" />
            </label>
          </div>
          <label className="block">
            <span className="field-label">聲音類型 *</span>
            <select name="category" required className="field-input" defaultValue="tapping">
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">聲音描述</span>
            <textarea
              name="description"
              maxLength={240}
              className="field-input min-h-24 resize-none"
              placeholder="這段聲音是怎麼錄的？適合什麼時候聽？"
            />
          </label>

          <label className="block cursor-pointer rounded-2xl border border-dashed border-white/20 p-6 text-center transition-colors hover:border-aurora-mint/50 hover:bg-white/[0.03]">
            <Icon name="upload" className="mx-auto size-6 text-aurora-mint" />
            <span className="mt-3 block text-sm font-medium">{fileName || '選擇音檔'}</span>
            <span className="mt-1 block text-xs text-mist/45">MP3、M4A、WAV、OGG 或 WebM，最大 {MAX_MB} MB</span>
            <input
              name="audio"
              required
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
            />
          </label>

          {message && (
            <p
              role="status"
              className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                message.ok ? 'bg-aurora-mint/10 text-aurora-mint' : 'bg-aurora-rose/10 text-aurora-rose'
              }`}
            >
              {message.text}
            </p>
          )}

          <button disabled={uploading} className="btn-primary w-full disabled:opacity-50">
            {uploading ? '正在上傳⋯' : '送出審核'} <Icon name="arrow" className="size-4" />
          </button>
          <p className="text-center text-[11px] leading-5 text-mist/40">
            送出即表示你擁有這段聲音的分享權利。內容會在審核通過後公開。
          </p>
        </form>
      </div>
    </div>
  )
}

// ─────────────── 底部播放器 PlayerProvider／PlayerBar ───────────────

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
