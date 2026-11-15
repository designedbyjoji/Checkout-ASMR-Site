'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FILTER_EVENT, listen } from '@/lib/events'
import { categoryLabels, type Track } from './site-content'
import { usePlayer } from './audio-player'
import { UploadDialog } from './track-upload-dialog'
import { Icon } from './icon'
import { MiniWave } from './mini-wave'
import { Section, SectionHeading } from './section-heading'

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
