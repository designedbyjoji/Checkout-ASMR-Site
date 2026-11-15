'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { categoryLabels, type Track } from '../site-content'
import { Icon, MiniWave, Section, SectionHeading } from '../shared'
import { usePlayer } from '../audio-player'

/**
 * 體驗頁 ▸ 聲音圖書館：音檔列表 ＋ 投稿上傳視窗
 * （底部播放器在 ui/audio-player.tsx）
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

  /* 從測驗結果過來時（網址有 ?category=類型），先幫忙篩選 */
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get('category')
    if (cat && tracks.some((t) => t.category === cat)) setFilter(cat)
  }, [tracks])

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
    const url = new URL('/experience/library', window.location.origin)
    url.searchParams.set('track', track.id)
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
          weight={{ index: 700, kicker: 700, title: 900, lead: 700 }}
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
        <button onClick={() => setUploadOpen(true)} className="btn-ghost reveal w-fit shrink-0 font-[500]">
          <Icon name="upload" className="size-4" /> 分享你的聲音
        </button>
      </div>

      {tracks.length > 0 && categories.length > 1 && (
        <div className="-mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <button className="chip font-[400]" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            全部 · {tracks.length}
          </button>
          {categories.map((c) => (
            <button key={c} className="chip font-[400]" aria-pressed={filter === c} onClick={() => setFilter(c)}>
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
                  active ? 'border-[#6ff5c866] shadow-[0_0_60px_-15px_#6ff5c880]' : ''
                } ${highlightId === track.id ? 'ring-2 ring-[#6ff5c899]' : ''}`}
              >
                <div className="flex items-center justify-between gap-3 text-xs font-[400] text-[#e6efee8c]">
                  <span className="rounded-full border border-[#ffffff1a] px-3 py-1">
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
                        ? 'bg-[#e6efee] text-[#050812]'
                        : 'bg-[#ffffff1a] text-[#e6efee] group-hover:bg-gradient-to-br group-hover:from-[#6ff5c8] group-hover:to-[#4cc9ff] group-hover:text-[#050812]'
                    }`}
                    aria-label={playing ? `暫停 ${track.title}` : `播放 ${track.title}`}
                  >
                    <Icon name={playing ? 'pause' : 'play'} className="size-5" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-[500]">{track.title}</h3>
                    <p className="truncate text-sm font-[400] text-[#e6efee80]">{track.creatorName}</p>
                  </div>
                </div>

                {track.description && (
                  <p className="mt-5 line-clamp-2 text-sm leading-6 font-[400] text-[#e6efee8c]">{track.description}</p>
                )}

                <div className="mt-auto flex items-center justify-between pt-6">
                  <MiniWave active={playing} />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleLike(track.id)}
                      className={`grid size-10 place-items-center rounded-full transition-colors hover:bg-[#ffffff0d] ${
                        isLiked ? 'text-[#ff9ad5]' : 'text-[#e6efee80]'
                      }`}
                      aria-label={isLiked ? '取消收藏' : '收藏'}
                      aria-pressed={isLiked}
                    >
                      <Icon name="heart" className={`size-[18px] ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => shareTrack(track)}
                      className="grid size-10 place-items-center rounded-full text-[#e6efee80] transition-colors hover:bg-[#ffffff0d] hover:text-[#e6efee]"
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
            <span className="animate-ping-soft absolute inset-0 rounded-full border border-[#6ff5c866]" />
            <Icon name="volume" className="size-7 text-[#6ff5c8]" />
          </div>
          <p className="mt-8 text-2xl font-[500]">聲音資料庫正在收集第一批聲音</p>
          <p className="mt-3 max-w-md text-sm leading-7 font-[400] text-[#e6efee8c]">
            上傳一段你錄下的 ASMR，成為第一位分享者。等待的同時，也可以先到聲音實驗室玩玩看。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => setUploadOpen(true)} className="btn-primary font-[600]">
              <Icon name="upload" className="size-4" /> 上傳聲音
            </button>
            <Link href="/experience/lab" className="btn-ghost font-[500]">
              前往聲音實驗室
            </Link>
          </div>
        </div>
      )}

      <UploadDialog open={uploadOpen} onClose={closeUpload} />

      <div
        role="status"
        className={`fixed top-[max(1rem,env(safe-area-inset-top))] left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#e6efee] px-5 py-2.5 text-sm font-[400] text-[#050812] shadow-xl transition-all duration-500 ${
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
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#050812b2] backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border border-[#ffffff1a] bg-[#0a1020f2] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[2rem] sm:p-9">
        <div className="flex items-start justify-between">
          <div>
            <p className="kicker font-[600]">Contribute</p>
            <h2 id="upload-title" className="mt-3 text-3xl font-[500]">
              分享你的聲音
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full border border-[#ffffff26] text-[#e6efeeb2] hover:text-[#e6efee]"
            aria-label="關閉上傳視窗"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="field-label font-[600]">作品名稱 *</span>
            <input ref={firstField} name="title" required maxLength={80} className="field-input font-[400]" placeholder="例如：清晨翻書聲" />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label font-[600]">創作者名稱 *</span>
              <input name="creatorName" required maxLength={50} className="field-input font-[400]" placeholder="你的稱呼" />
            </label>
            <label className="block">
              <span className="field-label font-[600]">錄製地點</span>
              <input name="origin" maxLength={40} className="field-input font-[400]" placeholder="例如：台灣・台北" />
            </label>
          </div>
          <label className="block">
            <span className="field-label font-[600]">聲音類型 *</span>
            <select name="category" required className="field-input font-[400]" defaultValue="tapping">
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label font-[600]">聲音描述</span>
            <textarea
              name="description"
              maxLength={240}
              className="field-input min-h-24 resize-none font-[400]"
              placeholder="這段聲音是怎麼錄的？適合什麼時候聽？"
            />
          </label>

          <label className="block cursor-pointer rounded-2xl border border-dashed border-[#ffffff33] p-6 text-center transition-colors hover:border-[#6ff5c880] hover:bg-[#ffffff08]">
            <Icon name="upload" className="mx-auto size-6 text-[#6ff5c8]" />
            <span className="mt-3 block text-sm font-[500]">{fileName || '選擇音檔'}</span>
            <span className="mt-1 block text-xs font-[400] text-[#e6efee73]">MP3、M4A、WAV、OGG 或 WebM，最大 {MAX_MB} MB</span>
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
              className={`rounded-xl px-4 py-3 text-sm leading-6 font-[400] ${
                message.ok ? 'bg-[#6ff5c81a] text-[#6ff5c8]' : 'bg-[#ff9ad51a] text-[#ff9ad5]'
              }`}
            >
              {message.text}
            </p>
          )}

          <button disabled={uploading} className="btn-primary w-full font-[600] disabled:opacity-50">
            {uploading ? '正在上傳⋯' : '送出審核'} <Icon name="arrow" className="size-4" />
          </button>
          <p className="text-center text-[11px] leading-5 font-[400] text-[#e6efee66]">
            送出即表示你擁有這段聲音的分享權利。內容會在審核通過後公開。
          </p>
        </form>
      </div>
    </div>
  )
}

