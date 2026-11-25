'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import logo from '@/imports/checkout-logo.svg'
import { categoryLabels, type Track } from '../site-content'
import { CheckoutLogo, Icon, Section, SectionHeading } from '../shared'
import { usePlayer } from '../audio-player'

/**
 * 體驗頁 ▸ 聲音資料庫：玻璃卡片（可左右滑）＋ 分享到 IG 限時動態 ＋ 投稿上傳視窗
 * （底部播放器在 ui/audio-player.tsx）
 */

// ─────────────── 聲音資料庫 Library ───────────────

/** 感官體驗 ▸ 聲音資料庫 */
export function Library({ tracks: allTracks }: { tracks: Track[] }) {
  const player = usePlayer()
  const tracks = useMemo(() => allTracks.filter((t) => t.url), [allTracks])
  const [filter, setFilter] = useState<string>('all')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [sharing, setSharing] = useState<Track | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const rowRef = useRef<HTMLUListElement>(null)

  const categories = useMemo(() => {
    const used = new Set(tracks.map((t) => t.category))
    return Object.keys(categoryLabels).filter((c) => used.has(c))
  }, [tracks])

  const visible = filter === 'all' ? tracks : tracks.filter((t) => t.category === filter)

  /* 從測驗結果過來時（網址有 ?category=類型），先幫忙篩選 */
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get('category')
    if (cat && tracks.some((t) => t.category === cat)) setFilter(cat)
  }, [tracks])

  /* 從分享連結（?track=xx）進來時，捲到那張卡片並標示出來 */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('track')
    if (!id) return
    setHighlightId(id)
    window.setTimeout(() => {
      document
        .getElementById(`track-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }, 700)
  }, [])

  /* 換篩選時，卡片列回到最左邊 */
  useEffect(() => {
    rowRef.current?.scrollTo({ left: 0 })
  }, [filter])

  const showToast = useCallback((text: string) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2200)
  }, [])

  /** 桌機用的「上一張／下一張」：一次捲動約一張卡片寬 */
  function scrollRow(direction: 1 | -1) {
    const row = rowRef.current
    const card = row?.querySelector('li')
    if (!row || !card) return
    row.scrollBy({
      left: direction * (card.getBoundingClientRect().width + 20) * 2,
      behavior: 'smooth',
    })
  }

  const closeUpload = useCallback(() => setUploadOpen(false), [])
  const closeShare = useCallback(() => setSharing(null), [])

  return (
    <Section id="library">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <SectionHeading
          weight={{ title: 900, lead: 700 }}
          title={
            <>
              選一個聲音，
              <br />
              慢慢待著
            </>
          }
          lead="來自不同角落、不同人的 ASMR。每段聲音都經過審核才會公開。"
        />
        <button
          onClick={() => setUploadOpen(true)}
          className="glass-button reveal w-fit shrink-0 gap-2 flex! px-6 py-3.5 text-sm font-[600] tracking-[0.12em]"
        >
          <Icon name="upload" className="size-4" /> 上傳你的聲音
        </button>
      </div>

      {tracks.length > 0 && (
        <div className="mt-12 flex items-center justify-between gap-4">
          {categories.length > 1 ? (
            <div className="-mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
              <button
                className="chip shrink-0 font-[400]"
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                全部 · {tracks.length}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  className="chip shrink-0 font-[400]"
                  aria-pressed={filter === c}
                  onClick={() => setFilter(c)}
                >
                  {categoryLabels[c]}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {visible.length > 1 && (
            <div className="hidden shrink-0 gap-2 sm:flex">
              <button
                onClick={() => scrollRow(-1)}
                className="glass-button size-11"
                aria-label="上一組聲音"
              >
                <Icon name="arrow" className="size-4 rotate-180" />
              </button>
              <button
                onClick={() => scrollRow(1)}
                className="glass-button size-11"
                aria-label="下一組聲音"
              >
                <Icon name="arrow" className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {tracks.length > 0 ? (
        /* 卡片橫向排一列，可左右滑；桌機會延伸到畫面右邊緣 */
        <ul
          ref={rowRef}
          className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-8 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 xl:mr-[calc(50%-50vw)]"
        >
          {visible.map((track) => {
            const active = player.track?.id === track.id
            const playing = active && player.playing
            return (
              <li
                key={track.id}
                id={`track-${track.id}`}
                className={`glass-card flex w-[78vw] max-w-[300px] shrink-0 snap-start flex-col rounded-[28px] p-5 transition-shadow duration-700 sm:w-[280px] ${
                  active ? 'border-[#6ff5c855]! shadow-[0_0_60px_-18px_#6ff5c880]' : ''
                } ${highlightId === track.id ? 'ring-2 ring-[#6ff5c899]' : ''}`}
              >
                <TrackCover track={track} className="rounded-[14px]" />

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-[700]">{track.title}</h3>
                    <p className="mt-0.5 truncate text-sm font-[500] text-[#e6efee80]">
                      {track.creatorName}
                    </p>
                  </div>
                  <button
                    onClick={() => setSharing(track)}
                    className="grid size-10 shrink-0 place-items-center rounded-full text-[#e6efee99] transition-colors hover:bg-[#ffffff0f] hover:text-[#e6efee]"
                    aria-label={`分享 ${track.title}`}
                  >
                    <Icon name="share" className="size-5" />
                  </button>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => player.toggle(track)}
                    className="glass-button size-14"
                    aria-pressed={playing}
                    aria-label={playing ? `暫停 ${track.title}` : `播放 ${track.title}`}
                  >
                    <Icon
                      name={playing ? 'pause' : 'play'}
                      className={`size-5 ${playing ? '' : 'translate-x-[1px]'}`}
                    />
                  </button>
                </div>

                <CheckoutLogo size="xs" className="mt-4 text-[#e6efee59]" />
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
      <ShareSheet track={sharing} onClose={closeShare} onToast={showToast} />

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

// ─────────────── 封面 TrackCover ───────────────

/** 沒有封面時的底色：夜空 ＋ 一點極光 */
const FALLBACK_COVER_BG =
  'radial-gradient(circle at 25% 20%, #6ff5c84d, transparent 55%), radial-gradient(circle at 80% 85%, #a98bff52, transparent 55%), #0c1324'

/** 正方形封面：有上傳（且審核通過）的封面就用照片，沒有就顯示 Checkout. Logo */
function TrackCover({ track, className = '' }: { track: Track; className?: string }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = Boolean(track.cover) && !failed
  return (
    <div className={`relative aspect-square w-full overflow-hidden ${className}`}>
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element -- 使用者上傳的圖片，尺寸不固定
        <img
          src={track.cover}
          alt={`${track.title} 的封面`}
          loading="lazy"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="grid size-full place-items-center text-[#e6efeee6]" style={{ background: FALLBACK_COVER_BG }}>
          <CheckoutLogo size="lg" />
        </div>
      )}
    </div>
  )
}

// ─────────────── 分享到 IG 限時動態 ShareSheet ───────────────

function trackLink(track: Track) {
  const url = new URL('/experience/library', window.location.origin)
  url.searchParams.set('track', track.id)
  return url.toString()
}

/** 分享視窗：產生 1080×1920 的限動圖片，可直接分享（手機）或下載（電腦），也可以複製連結 */
function ShareSheet({
  track,
  onClose,
  onToast,
}: {
  track: Track | null
  onClose: () => void
  onToast: (text: string) => void
}) {
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null)
  const [failed, setFailed] = useState(false)
  const [canShareFiles, setCanShareFiles] = useState(false)

  useEffect(() => {
    if (!track) return
    let cancelled = false
    let objectUrl = ''
    setImage(null)
    setFailed(false)
    makeStoryImage(track)
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setImage({ blob, url: objectUrl })
        const file = new File([blob], 'checkout-story.png', { type: 'image/png' })
        setCanShareFiles(Boolean(navigator.canShare?.({ files: [file] })))
      })
      .catch(() => !cancelled && setFailed(true))

    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [track, onClose])

  if (!track) return null

  async function shareImage() {
    if (!image || !track) return
    const file = new File([image.blob], `checkout-${track.id}.png`, { type: 'image/png' })
    if (canShareFiles) {
      try {
        await navigator.share({ files: [file] })
      } catch {
        /* 使用者取消分享 */
      }
      return
    }
    const a = document.createElement('a')
    a.href = image.url
    a.download = file.name
    a.click()
    onToast('限動圖片已下載')
  }

  async function copyLink() {
    if (!track) return
    try {
      await navigator.clipboard.writeText(trackLink(track))
      onToast('連結已複製')
    } catch {
      onToast('無法複製，請長按網址列複製')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#050812b2] backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-card max-h-[94svh] w-full max-w-md overflow-y-auto rounded-t-[2rem] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-[2rem] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="kicker font-[600]">Share to Story</p>
            <h2 id="share-title" className="mt-2 truncate text-2xl font-[600]">
              分享「{track.title}」
            </h2>
          </div>
          <button
            onClick={onClose}
            className="glass-button size-10 shrink-0"
            aria-label="關閉分享視窗"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <div className="mx-auto mt-6 aspect-[9/16] h-[min(52svh,460px)] overflow-hidden rounded-2xl border border-[#ffffff1a] bg-[#0a1020]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- 瀏覽器即時產生的圖片
            <img src={image.url} alt="限時動態圖片預覽" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center px-6 text-center text-sm font-[400] text-[#e6efee80]">
              {failed ? '圖片產生失敗，可以先複製連結分享。' : '正在製作限動圖片⋯'}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3">
          <button
            onClick={shareImage}
            disabled={!image}
            className="btn-primary w-full font-[600] disabled:opacity-50"
          >
            <Icon name={canShareFiles ? 'share' : 'down'} className="size-4" />
            {canShareFiles ? '分享到 IG 限時動態' : '下載限動圖片'}
          </button>
          <button onClick={copyLink} className="btn-ghost w-full font-[500]">
            複製聲音連結
          </button>
        </div>
        <p className="mt-4 text-center text-xs leading-5 font-[400] text-[#e6efee73]">
          {canShareFiles
            ? '在分享選單選 Instagram →「限時動態」。'
            : '用手機打開這頁，就能直接分享到 Instagram。'}
          <br />
          再加上「連結」貼紙、貼上聲音連結，朋友就能點進來聽。
        </p>
      </div>
    </div>
  )
}

/* 限動圖片（1080×1920）用畫布畫出來：極光背景 ＋ 玻璃卡片 ＋ 封面 ＋ 標題 */

const STORY_FONT = `'Chiron Hei HK Text', -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC', sans-serif`

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** 把黑色的 Logo SVG 染成指定顏色（回傳一張畫布） */
async function tintedLogo(color: string, height: number) {
  const img = await loadImage(logo.src)
  const ratio =
    img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 284 / 73
  const c = document.createElement('canvas')
  c.width = Math.round(height * ratio)
  c.height = height
  const ctx = c.getContext('2d')!
  ctx.drawImage(img, 0, 0, c.width, c.height)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, c.width, c.height)
  return c
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** 文字太長就加「…」 */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1)
  return `${t}…`
}

async function makeStoryImage(track: Track): Promise<Blob> {
  const W = 1080
  const H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  try {
    await Promise.all([
      document.fonts.load(`700 60px ${STORY_FONT}`),
      document.fonts.load(`500 40px ${STORY_FONT}`),
    ])
  } catch {
    /* 字型讀不到就用系統字 */
  }

  // 背景：夜色 ＋ 極光光暈
  ctx.fillStyle = '#050812'
  ctx.fillRect(0, 0, W, H)
  const glow = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(1, 'rgba(5,8,18,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }
  glow(180, 260, 820, 'rgba(111,245,200,0.32)')
  glow(880, 520, 700, 'rgba(76,201,255,0.22)')
  glow(940, 1500, 820, 'rgba(169,139,255,0.34)')
  glow(120, 1780, 620, 'rgba(255,154,213,0.18)')

  // 上方 Logo
  const topLogo = await tintedLogo('rgba(230,239,238,0.92)', 64).catch(() => null)
  if (topLogo) ctx.drawImage(topLogo, (W - topLogo.width) / 2, 190)
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(230,239,238,0.55)'
  ctx.font = `600 26px ${STORY_FONT}`
  if ('letterSpacing' in ctx)
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '8px'
  ctx.fillText('ASMR SOUND LIBRARY', W / 2, 310)
  if ('letterSpacing' in ctx)
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px'

  // 玻璃卡片
  const cardX = 150
  const cardW = W - cardX * 2
  const pad = 52
  const coverSize = cardW - pad * 2
  const cardY = 400
  const cardH = pad + coverSize + 230 + 150 + 70
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.55)'
  ctx.shadowBlur = 80
  ctx.shadowOffsetY = 30
  roundedRect(ctx, cardX, cardY, cardW, cardH, 56)
  ctx.fillStyle = 'rgba(14,20,34,0.72)'
  ctx.fill()
  ctx.restore()
  const sheen = ctx.createLinearGradient(cardX, cardY, cardX + cardW * 0.4, cardY + cardH)
  sheen.addColorStop(0, 'rgba(255,255,255,0.14)')
  sheen.addColorStop(0.5, 'rgba(255,255,255,0.03)')
  sheen.addColorStop(1, 'rgba(255,255,255,0.07)')
  roundedRect(ctx, cardX, cardY, cardW, cardH, 56)
  ctx.fillStyle = sheen
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.stroke()

  // 封面
  const coverX = cardX + pad
  const coverY = cardY + pad
  ctx.save()
  roundedRect(ctx, coverX, coverY, coverSize, coverSize, 28)
  ctx.clip()
  const photo = track.cover ? await loadImage(track.cover).catch(() => null) : null
  if (photo) {
    const s = Math.min(photo.naturalWidth, photo.naturalHeight)
    ctx.drawImage(
      photo,
      (photo.naturalWidth - s) / 2,
      (photo.naturalHeight - s) / 2,
      s,
      s,
      coverX,
      coverY,
      coverSize,
      coverSize,
    )
  } else {
    ctx.fillStyle = '#0c1324'
    ctx.fillRect(coverX, coverY, coverSize, coverSize)
    const g1 = ctx.createRadialGradient(
      coverX + coverSize * 0.25,
      coverY + coverSize * 0.2,
      0,
      coverX + coverSize * 0.25,
      coverY + coverSize * 0.2,
      coverSize * 0.6,
    )
    g1.addColorStop(0, 'rgba(111,245,200,0.28)')
    g1.addColorStop(1, 'rgba(111,245,200,0)')
    ctx.fillStyle = g1
    ctx.fillRect(coverX, coverY, coverSize, coverSize)
    const g2 = ctx.createRadialGradient(
      coverX + coverSize * 0.8,
      coverY + coverSize * 0.85,
      0,
      coverX + coverSize * 0.8,
      coverY + coverSize * 0.85,
      coverSize * 0.6,
    )
    g2.addColorStop(0, 'rgba(169,139,255,0.3)')
    g2.addColorStop(1, 'rgba(169,139,255,0)')
    ctx.fillStyle = g2
    ctx.fillRect(coverX, coverY, coverSize, coverSize)
    const mark = await tintedLogo('rgba(230,239,238,0.9)', 110).catch(() => null)
    if (mark)
      ctx.drawImage(
        mark,
        coverX + (coverSize - mark.width) / 2,
        coverY + (coverSize - mark.height) / 2,
      )
  }
  ctx.restore()

  // 標題、創作者
  ctx.textAlign = 'left'
  const textY = coverY + coverSize + 100
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 60px ${STORY_FONT}`
  ctx.fillText(fitText(ctx, track.title, coverSize), coverX, textY)
  ctx.fillStyle = 'rgba(230,239,238,0.55)'
  ctx.font = `500 40px ${STORY_FONT}`
  ctx.fillText(fitText(ctx, track.creatorName, coverSize), coverX, textY + 64)

  // 玻璃播放鍵
  const cx = W / 2
  const cy = textY + 64 + 130
  const r = 62
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.6)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 12
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  const btn = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  btn.addColorStop(0, 'rgba(255,255,255,0.2)')
  btn.addColorStop(1, 'rgba(255,255,255,0.05)')
  ctx.fillStyle = btn
  ctx.fill()
  ctx.restore()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - 14, cy - 22)
  ctx.lineTo(cx + 22, cy)
  ctx.lineTo(cx - 14, cy + 22)
  ctx.closePath()
  ctx.lineJoin = 'round'
  ctx.lineWidth = 5
  ctx.strokeStyle = 'rgba(230,239,238,0.9)'
  ctx.stroke()

  // 卡片左下角小 Logo
  const small = await tintedLogo('rgba(230,239,238,0.4)', 30).catch(() => null)
  if (small) ctx.drawImage(small, coverX, cardY + cardH - pad - 22)

  // 卡片下方說明
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(230,239,238,0.7)'
  ctx.font = `500 36px ${STORY_FONT}`
  ctx.fillText('戴上耳機，來 Checkout. 聽完整聲音', W / 2, cardY + cardH + 120)
  ctx.fillStyle = 'rgba(111,245,200,0.85)'
  ctx.font = `500 30px ${STORY_FONT}`
  ctx.fillText(window.location.host, W / 2, cardY + cardH + 175)

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/png',
    ),
  )
}

// ─────────────── 投稿上傳視窗 UploadDialog ───────────────

// Vercel 每次請求上限約 4.5 MB；約等於 4 分鐘的 128kbps MP3（封面另外會壓縮到約 0.1–0.3 MB）
const MAX_MB = 4
const MAX_TOTAL_BYTES = 4.3 * 1024 * 1024
const ACCEPT = 'audio/mpeg,audio/mp4,audio/x-m4a,audio/ogg,audio/wav,audio/x-wav,audio/webm'

/** 封面在上傳前先裁成正方形、縮成 1080px 的 JPEG，檔案小、上傳快 */
async function prepareCover(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const s = Math.min(img.naturalWidth, img.naturalHeight)
    const size = Math.min(1080, s)
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    c.getContext('2d')!.drawImage(
      img,
      (img.naturalWidth - s) / 2,
      (img.naturalHeight - s) / 2,
      s,
      s,
      0,
      0,
      size,
      size,
    )
    return await new Promise((resolve, reject) =>
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.85),
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function UploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [fileName, setFileName] = useState('')
  const [cover, setCover] = useState<{ blob: Blob; url: string } | null>(null)
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

  /* 換封面或關掉時，釋放預覽圖的記憶體 */
  useEffect(
    () => () => {
      if (cover) URL.revokeObjectURL(cover.url)
    },
    [cover],
  )

  async function pickCover(file: File | undefined) {
    if (!file) return setCover(null)
    try {
      const blob = await prepareCover(file)
      setCover({ blob, url: URL.createObjectURL(blob) })
    } catch {
      setCover(null)
      setMessage({ ok: false, text: '這張圖片讀不出來，請換一張 JPG 或 PNG。' })
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // 先把表單存起來：await 之後 event.currentTarget 會變成 null
    const form = event.currentTarget
    const data = new FormData(form)
    const file = data.get('audio')
    if (file instanceof File && file.size > MAX_MB * 1024 * 1024) {
      setMessage({
        ok: false,
        text: `檔案超過 ${MAX_MB} MB，請剪短一點，或轉成 MP3 / M4A 再上傳。`,
      })
      return
    }
    if (cover) data.set('cover', cover.blob, 'cover.jpg')
    if (file instanceof File && file.size + (cover?.blob.size ?? 0) > MAX_TOTAL_BYTES) {
      setMessage({ ok: false, text: '音檔加封面有點太大了，請把音檔剪短一點再上傳。' })
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
        setCover(null)
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
      <div className="glass-card max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-[2rem] sm:p-9">
        <div className="flex items-start justify-between">
          <div>
            <p className="kicker font-[600]">Contribute</p>
            <h2 id="upload-title" className="mt-3 text-3xl font-[500]">
              上傳你的聲音
            </h2>
          </div>
          <button onClick={onClose} className="glass-button size-10" aria-label="關閉上傳視窗">
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="field-label font-[600]">作品名稱 *</span>
            <input
              ref={firstField}
              name="title"
              required
              maxLength={80}
              className="field-input font-[400]"
              placeholder="例如：清晨翻書聲"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label font-[600]">創作者名稱 *</span>
              <input
                name="creatorName"
                required
                maxLength={50}
                className="field-input font-[400]"
                placeholder="你的稱呼"
              />
            </label>
            <label className="block">
              <span className="field-label font-[600]">聲音類型 *</span>
              <select
                name="category"
                required
                className="field-input font-[400]"
                defaultValue="tapping"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="field-label font-[600]">聲音描述</span>
            <textarea
              name="description"
              maxLength={240}
              className="field-input min-h-24 resize-none font-[400]"
              placeholder="這段聲音是怎麼錄的？適合什麼時候聽？"
            />
          </label>

          {/* 封面（選填）：預覽會跟網站卡片一樣裁成正方形 */}
          <div>
            <span className="field-label font-[600]">封面照片（選填）</span>
            <div className="flex items-center gap-4">
              <label className="glass-card relative block size-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl transition-colors hover:border-[#6ff5c880]!">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element -- 本機預覽
                  <img src={cover.url} alt="封面預覽" className="size-full object-cover" />
                ) : (
                  <span className="grid size-full place-items-center px-2 text-[#e6efeecc]" style={{ background: FALLBACK_COVER_BG }}>
                    <CheckoutLogo size="xs" />
                  </span>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/*"
                  className="sr-only"
                  aria-label="選擇封面照片"
                  onChange={(e) => pickCover(e.target.files?.[0])}
                />
              </label>
              <div className="min-w-0 text-xs leading-5 font-[400] text-[#e6efee80]">
                <p className="text-sm font-[500] text-[#e6efee]">
                  {cover ? '已選擇封面' : '點左邊方框選一張照片'}
                </p>
                <p className="mt-1">
                  會自動裁成正方形，跟聲音一起審核。沒有照片的話，會使用 Checkout. 的 Logo。
                </p>
                {cover && (
                  <button
                    type="button"
                    onClick={() => setCover(null)}
                    className="mt-1 text-[#6ff5c8] underline-offset-4 hover:underline"
                  >
                    改用 Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          <label className="block cursor-pointer rounded-2xl border border-dashed border-[#ffffff33] p-6 text-center transition-colors hover:border-[#6ff5c880] hover:bg-[#ffffff08]">
            <Icon name="upload" className="mx-auto size-6 text-[#6ff5c8]" />
            <span className="mt-3 block text-sm font-[500]">{fileName || '選擇音檔 *'}</span>
            <span className="mt-1 block text-xs font-[400] text-[#e6efee73]">
              MP3、M4A、WAV、OGG 或 WebM，最大 {MAX_MB} MB
            </span>
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

          <button
            disabled={uploading}
            className="btn-primary w-full font-[600] disabled:opacity-50"
          >
            {uploading ? '正在上傳⋯' : '送出審核'} <Icon name="arrow" className="size-4" />
          </button>
          <p className="text-center text-[11px] leading-5 font-[400] text-[#e6efee66]">
            送出即表示你擁有這段聲音與封面的分享權利。內容會在審核通過後公開。
          </p>
        </form>
      </div>
    </div>
  )
}
