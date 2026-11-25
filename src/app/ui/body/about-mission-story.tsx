'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { missionStory } from '../site-content'
import { Icon } from '../shared'

/**
 * 關於我們 ▸ 創立初衷：像 Apple 官網那樣「往下滑就會動」的捲動故事
 * ------------------------------------------------------------
 * 原理：每一幕（Scene）都比一個螢幕高，裡面的畫面會「黏」在螢幕上（sticky），
 * 你往下滑的距離換算成 0 → 1 的進度 p，動畫就照著 p 播放。往回滑，動畫也會倒帶。
 *
 * 五幕，各抓文案裡的一個關鍵字：
 *   1 SpeedScene   更快 → 放慢：亂跳的聲波慢慢變成平穩的波
 *   2 NoiseScene   資訊 → 安靜：手機通知一個個飄走
 *   3 EarsScene    親耳：聲波從左右兩邊靠近耳朵
 *   4 ReceiptScene 結帳：一張收據慢慢印出來，蓋上 CHECKED OUT
 *   5 LeaveScene   離開一下：狀態從「忙碌中」切換成「暫時離開」
 *
 * 文字都在 site-content.ts 的 missionStory。
 * 手機開了「減少動態效果」的人，會看到 fallback（原本的純文字版）。
 */

// ─────────────── 整個捲動故事 MissionStory ───────────────

export function MissionStory({ fallback }: { fallback: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <>{fallback}</>

  return (
    <div className="relative">
      <SpeedScene />
      <NoiseScene />
      <EarsScene />
      <ReceiptScene />
      <LeaveScene />
    </div>
  )
}

// ─────────────── 第 1 幕：更快 → 放慢 ───────────────

function SpeedScene() {
  const s = missionStory.speed
  const slowChars = [...s.slow]

  return (
    <Scene screens={3} label={`${s.fast}${s.slow}`}>
      {(p) => {
        const rush = range(p, 0.16, 0.42) // 「更快」那句衝出畫面
        const calm = ease(range(p, 0.2, 0.78)) // 聲波變平穩
        const spread = ease(range(p, 0.45, 0.95)) // 「放慢」字距慢慢拉開
        return (
          <div className="flex w-full max-w-6xl flex-col items-center text-center">
            <div className="grid w-full place-items-center">
              {/* 更快：往右衝出去，後面拖著殘影 */}
              {[3, 2, 1, 0].map((k) => (
                <p
                  key={k}
                  aria-hidden="true"
                  className="text-[clamp(1.75rem,6.5vw,4rem)] leading-tight font-[900] tracking-[0.02em] [grid-area:1/1]"
                  style={{
                    opacity: k === 0 ? 1 - rush : (1 - rush) * rush * (0.5 - k * 0.12),
                    transform: `translateX(${ease(rush) * 70 - k * rush * 6}vw)`,
                  }}
                >
                  {s.fast}
                </p>
              ))}
              {/* 放慢：一個字一個字出現，字距越拉越開 */}
              <p
                aria-hidden="true"
                className="text-[clamp(2rem,8.5vw,5.5rem)] leading-tight font-[900] [grid-area:1/1]"
                style={{ letterSpacing: `${spread * 0.25}em`, marginRight: `-${spread * 0.25}em` }}
              >
                {slowChars.map((c, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={{
                      opacity: range(p, 0.45 + i * 0.05, 0.58 + i * 0.05),
                      transform: `translateY(${(1 - ease(range(p, 0.45 + i * 0.05, 0.62 + i * 0.05))) * 24}px)`,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </p>
            </div>

            <Wave calm={calm} p={p} />

            <p
              aria-hidden="true"
              className="mt-6 flex flex-col items-center gap-3 text-xs font-[400] tracking-[0.4em] text-[#e6efee80]"
              style={{ opacity: 1 - range(p, 0.04, 0.14) }}
            >
              {s.hint}
              <Icon name="down" className="mission-hint size-4" />
            </p>
          </div>
        )
      }}
    </Scene>
  )
}

/** 三條疊在一起的聲波：calm = 0 時又快又亂，calm = 1 時又慢又順 */
function Wave({ calm, p }: { calm: number; p: number }) {
  const layers = [
    { color: '#ff9ad5', width: 1.5, opacity: 0.55, shift: 0 },
    { color: '#4cc9ff', width: 1.5, opacity: 0.6, shift: 1.3 },
    { color: '#6ff5c8', width: 2.5, opacity: 0.95, shift: 2.6 },
  ]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 240"
      preserveAspectRatio="none"
      className="mt-10 h-[22svh] max-h-56 w-full max-w-5xl sm:mt-14"
    >
      {layers.map((l, i) => (
        <path
          key={i}
          d={wavePath(calm, p, l.shift)}
          fill="none"
          stroke={l.color}
          strokeWidth={l.width}
          strokeOpacity={l.opacity * (i === 2 ? 1 : 1 - calm * 0.6)}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}

function wavePath(calm: number, p: number, shift: number) {
  const W = 1000
  const H = 240
  const N = 140
  const freq = mix(16, 1.6, calm) // 波的密度：越來越稀
  const amp = mix(80, 46, calm) // 波的高度
  const phase = p * mix(60, 6, calm) + shift
  let d = ''
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const envelope = Math.sin(Math.PI * t) // 兩端收細
    // 雜訊：好幾個高頻波疊在一起，calm 越大雜訊越少
    const noise =
      (Math.sin(t * 97 + phase * 2.3) * 0.5 + Math.sin(t * 53 - phase * 1.7) * 0.35 + Math.sin(t * 181 + shift) * 0.25) *
      (1 - calm) *
      60
    const y = H / 2 + (Math.sin(t * freq * Math.PI * 2 + phase) * amp + noise) * envelope
    d += `${i === 0 ? 'M' : 'L'}${(t * W).toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

// ─────────────── 第 2 幕：資訊 → 安靜 ───────────────

/** 通知泡泡在手機四周的位置（以手機中心為原點，單位約等於手機寬度） */
const BUBBLE_SPOTS = [
  [-1.0, -0.82],
  [0.95, -0.66],
  [-1.08, -0.3],
  [1.05, -0.14],
  [-0.98, 0.18],
  [1.02, 0.36],
  [-1.04, 0.6],
  [0.92, 0.8],
  [-0.28, -1.02],
  [0.32, 1.02],
] as const

function NoiseScene() {
  const s = missionStory.noise

  return (
    <Scene screens={3.5} label={`${s.intro}${s.lines.join('')}`}>
      {(p) => {
        const introOut = range(p, 0.1, 0.18)
        const phoneIn = ease(range(p, 0.12, 0.26))
        const quiet = ease(range(p, 0.66, 0.86))
        const lineAt = [range(p, 0.18, 0.26), range(p, 0.4, 0.48), range(p, 0.68, 0.76)]
        const current = lineAt[2] > 0.5 ? 2 : lineAt[1] > 0.5 ? 1 : 0

        return (
          <div aria-hidden="true" className="grid w-full max-w-6xl place-items-center">
            {/* 開場說明 */}
            <p
              className="max-w-xl text-center text-lg leading-9 font-[400] text-[#e6efeecc] [grid-area:1/1] sm:text-2xl sm:leading-[1.8]"
              style={{ opacity: 1 - introOut, transform: `translateY(${-introOut * 40}px)` }}
            >
              {s.intro}
            </p>

            <div
              className="flex flex-col items-center gap-8 [grid-area:1/1] sm:gap-12"
              style={{ opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 60}px)` }}
            >
              {/* 三句話：說到哪一句，哪一句就亮起來 */}
              <div className="flex flex-col items-center gap-1 text-center text-[clamp(1.35rem,4.5vw,2.5rem)] leading-snug font-[900]">
                {s.lines.map((line, i) => (
                  <p
                    key={i}
                    style={{
                      opacity: lineAt[i] * (i === current ? 1 : 0.3),
                      transform: `translateY(${(1 - ease(lineAt[i])) * 16}px)`,
                      color: i === 2 ? undefined : '#e6efee',
                    }}
                    className={i === 2 ? 'aurora-text' : ''}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* 手機＋四周的通知泡泡 */}
              <div className="relative [--u:100px] sm:[--u:170px]">
                <Phone quiet={quiet} />
                {s.bubbles.map((text, i) => {
                  const [x, y] = BUBBLE_SPOTS[i % BUBBLE_SPOTS.length]
                  const pop = ease(range(p, 0.2 + i * 0.018, 0.28 + i * 0.018))
                  const away = ease(range(p, 0.42 + i * 0.022, 0.62 + i * 0.022))
                  const drift = 1 + away * 1.4
                  return (
                    <span
                      key={text}
                      className="glass absolute top-1/2 left-1/2 rounded-2xl px-3 py-2 text-[11px] font-[500] whitespace-nowrap text-[#e6efeee6] shadow-[0_10px_30px_-10px_#000] sm:px-4 sm:text-sm"
                      style={{
                        transform: `translate(-50%, -50%) translate(calc(${x * drift} * var(--u)), calc(${y * drift} * var(--u))) scale(${mix(0.7, 1, pop)})`,
                        opacity: pop * (1 - away),
                        filter: `blur(${away * 6}px)`,
                      }}
                    >
                      {text}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        )
      }}
    </Scene>
  )
}

/** 手機外框：quiet 越大，畫面上的雜亂越少，最後只剩一顆慢慢呼吸的光 */
function Phone({ quiet }: { quiet: number }) {
  return (
    <div className="relative h-[min(300px,36svh)] w-[min(150px,18svh)] rounded-[28px] border border-[#ffffff2e] bg-[#0a1020] p-2 shadow-[0_30px_80px_-20px_#000] sm:h-[min(400px,40svh)] sm:w-[min(200px,20svh)] sm:rounded-[36px]">
      <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-gradient-to-b from-[#121a30] to-[#070b18] sm:rounded-[28px]">
        {/* 很吵的 App 畫面 */}
        <div className="flex flex-col gap-2 p-3" style={{ opacity: 1 - quiet }}>
          {[80, 55, 90, 40, 70, 60, 85].map((w, i) => (
            <span key={i} className="block h-2 rounded-full bg-[#ffffff26]" style={{ width: `${w}%` }} />
          ))}
          <span className="mt-1 block h-14 rounded-xl bg-gradient-to-br from-[#ff9ad540] to-[#4cc9ff33]" />
          {[65, 90, 50].map((w, i) => (
            <span key={i} className="block h-2 rounded-full bg-[#ffffff1f]" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* 安靜下來 */}
        <div className="absolute inset-0 grid place-items-center" style={{ opacity: quiet }}>
          <span className="mission-breathe block size-16 rounded-full bg-[radial-gradient(circle,#6ff5c8cc,#4cc9ff33_60%,transparent_70%)] sm:size-20" />
        </div>
      </div>
    </div>
  )
}

// ─────────────── 第 3 幕：親耳 ───────────────

function EarsScene() {
  const s = missionStory.ears

  return (
    <Scene screens={3} label={`${s.before}「${s.keyword}」${s.after}`}>
      {(p) => {
        const near = ease(range(p, 0, 0.4)) // 聲波從兩側靠近
        const textIn = 1 // 一進場就看得到，避免畫面空白
        const keyIn = ease(range(p, 0, 0.3))
        return (
          <div className="flex w-full max-w-5xl flex-col items-center text-center">
            <p
              aria-hidden="true"
              className="text-lg leading-8 font-[700] whitespace-pre-line text-[#e6efeecc] sm:text-2xl sm:leading-10"
              style={{ opacity: textIn, transform: `translateY(${(1 - textIn) * 20}px)` }}
            >
              {s.before}
            </p>

            <div className="relative my-4 flex items-center sm:my-6" aria-hidden="true">
              <SoundArcs side="left" near={near} />
              <p
                className="aurora-text px-2 text-[clamp(4rem,20vw,10rem)] leading-none font-[900] tracking-[0.08em]"
                style={{ opacity: keyIn, transform: `scale(${mix(0.85, 1, keyIn)})` }}
              >
                {s.keyword}
              </p>
              <SoundArcs side="right" near={near} />
            </div>

            <p
              aria-hidden="true"
              className="text-lg font-[700] text-[#e6efeecc] sm:text-2xl"
              style={{ opacity: keyIn }}
            >
              {s.after}
            </p>

            {/* 三個可以「親耳」體驗的地方 */}
            <ul className="mt-8 grid w-full max-w-3xl gap-2.5 sm:mt-12 sm:grid-cols-3 sm:gap-4">
              {s.features.map((f, i) => {
                const show = ease(range(p, 0.5 + i * 0.1, 0.66 + i * 0.1))
                return (
                  <li
                    key={f.title}
                    style={{
                      opacity: show,
                      transform: `translateY(${(1 - show) * 30}px)`,
                      pointerEvents: show > 0.5 ? 'auto' : 'none',
                    }}
                  >
                    <Link
                      href={f.href}
                      tabIndex={show > 0.5 ? undefined : -1}
                      className="glass group flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-left transition-colors hover:border-[#6ff5c866] sm:flex-col sm:items-start sm:rounded-3xl sm:px-6 sm:py-6"
                    >
                      <span>
                        <span className="block text-base font-[900] sm:text-lg">{f.title}</span>
                        <span className="mt-0.5 block text-xs leading-5 font-[400] text-[#e6efee99] sm:mt-2 sm:text-sm">
                          {f.body}
                        </span>
                      </span>
                      <Icon
                        name="arrow"
                        className="size-4 shrink-0 text-[#6ff5c8] transition-transform duration-500 group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }}
    </Scene>
  )
}

/** 一組弧線聲波：left 的在字左邊、往右傳；right 相反。near = 1 時貼到字旁邊 */
function SoundArcs({ side, near }: { side: 'left' | 'right'; near: number }) {
  const dir = side === 'left' ? -1 : 1
  return (
    <svg
      viewBox="0 0 60 100"
      className="h-[clamp(4rem,18vw,9rem)] w-auto shrink-0"
      style={{
        transform: `translateX(${dir * (1 - near) * 30}vw) scaleX(${dir})`,
        opacity: mix(0.15, 1, near),
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M ${10 + i * 13} ${14 + i * 6} Q ${-6 + i * 13} 50 ${10 + i * 13} ${86 - i * 6}`}
          fill="none"
          stroke={i % 2 ? '#4cc9ff' : '#6ff5c8'}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={1 - i * 0.2}
        />
      ))}
    </svg>
  )
}

// ─────────────── 第 4 幕：結帳（收據） ───────────────

function ReceiptScene() {
  const s = missionStory.receipt

  return (
    <Scene screens={3.5} label={`${s.lead}${s.keyword}`}>
      {(p) => {
        const capIn = 1 // 一進場就看得到
        const printed = ease(range(p, 0.12, 0.7)) // 收據印出來的比例
        const stamp = ease(range(p, 0.74, 0.86))
        return (
          <div
            aria-hidden="true"
            className="flex w-full max-w-5xl flex-col items-center gap-6 sm:gap-10 lg:flex-row lg:justify-between lg:gap-16"
          >
            <div
              className="text-center lg:text-left"
              style={{ opacity: capIn, transform: `translateY(${(1 - capIn) * 24}px)` }}
            >
              <p className="text-lg font-[700] text-[#e6efeecc] sm:text-2xl">{s.lead}</p>
              <p className="aurora-text mt-1 text-[clamp(3rem,11vw,7rem)] leading-none font-[900] tracking-[0.04em] lg:-ml-[0.5em]">
                {s.keyword}
              </p>
            </div>

            {/* 收據機：上面是出紙口，收據從裡面往下印出來 */}
            <div className="flex w-[min(280px,80vw)] flex-col items-center sm:w-[300px] lg:w-[360px]">
              <div className="relative z-10 h-4 w-[112%] rounded-full border border-[#ffffff2e] bg-[#0a1020] shadow-[0_8px_24px_-6px_#000]">
                <span className="absolute inset-x-6 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[#000]" />
              </div>
              <div className="-mt-2 w-full overflow-hidden pt-2">
                <div
                  className="receipt-paper relative px-6 pt-6 pb-9 font-mono text-[13px] leading-6 text-[#0a1020] sm:text-sm"
                  style={{ transform: `translateY(${(printed - 1) * 100}%)` }}
                >
                  <p className="text-center font-[700] tracking-[0.08em]">{s.shop}</p>
                  <p className="text-center text-[11px] text-[#0a102099]">TODAY · 23:59 · NO.0001</p>
                  <hr className="my-3 border-t border-dashed border-[#0a102066]" />
                  {s.items.map((item) => (
                    <p key={item.name} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{item.qty}</span>
                    </p>
                  ))}
                  <hr className="my-3 border-t border-dashed border-[#0a102066]" />
                  <p className="flex justify-between text-base font-[700]">
                    <span>{s.totalLabel}</span>
                    <span>{s.total}</span>
                  </p>
                  <p className="mt-4 text-center text-[11px] tracking-[0.2em] text-[#0a102099]">{s.thanks}</p>

                  {/* 印章 */}
                  <span
                    className="absolute top-1/2 left-1/2 rounded-lg border-[3px] border-[#e2558f] px-3 py-1 font-sans text-xl font-[900] tracking-[0.12em] whitespace-nowrap text-[#e2558f] sm:text-2xl"
                    style={{
                      opacity: stamp * 0.88,
                      transform: `translate(-50%, -50%) rotate(-14deg) scale(${mix(1.5, 1, stamp)})`,
                    }}
                  >
                    {s.stamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </Scene>
  )
}

// ─────────────── 第 5 幕：離開一下（登出） ───────────────

function LeaveScene() {
  const s = missionStory.leave
  const closingChars = [...s.closing]

  return (
    <Scene screens={3} label={`${s.lead}${s.keyword}。${s.closing}`}>
      {(p) => {
        const intro = 1 // 一進場就看得到
        const out = ease(range(p, 0.08, 0.42)) // 「out」飄走
        const flip = ease(range(p, 0.28, 0.46)) // 狀態切換
        const cta = ease(range(p, 0.86, 0.96))
        return (
          <div className="relative flex w-full max-w-4xl flex-col items-center text-center">
            {/* 切換成「暫時離開」後，背後亮起一圈柔光 */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 size-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#6ff5c82e,transparent_65%)]"
              style={{ opacity: flip }}
            />

            <div aria-hidden="true" className="relative" style={{ opacity: intro }}>
              <p className="font-serif text-2xl text-[#e6efee99] italic sm:text-3xl">
                Check
                <span
                  className="inline-block pl-[0.3em]"
                  style={{ transform: `translate(${out * 1.6}em, ${-out * 0.8}em)`, opacity: 1 - out * 0.75 }}
                >
                  out
                </span>
              </p>
              <p className="mt-2 text-lg font-[700] text-[#e6efeecc] sm:text-2xl">
                {s.lead}
                <span className="aurora-text ml-1 text-[clamp(2.25rem,9vw,4.5rem)] align-middle font-[900]">
                  {s.keyword}
                </span>
              </p>
            </div>

            {/* 狀態開關：忙碌中 → 暫時離開 */}
            <div
              aria-hidden="true"
              className="glass relative mt-8 flex items-center gap-4 rounded-full py-2 pr-5 pl-2 sm:mt-10"
              style={{ opacity: intro }}
            >
              <span
                className="relative h-8 w-14 rounded-full border border-[#ffffff26]"
                style={{ background: `color-mix(in oklab, #6ff5c8 ${flip * 45}%, #ff9ad5 ${(1 - flip) * 30}%)` }}
              >
                <span
                  className="absolute top-1 left-1 grid size-6 place-items-center rounded-full bg-[#e6efee] text-[#050812] shadow"
                  style={{ transform: `translateX(${flip * 24}px)` }}
                >
                  <Icon name="moon" className="size-3.5" />
                </span>
              </span>
              <span className="grid text-left text-base font-[700]">
                <span className="text-[#ff9ad5] [grid-area:1/1]" style={{ opacity: 1 - flip }}>
                  ● {s.busy}
                </span>
                <span className="text-[#6ff5c8] [grid-area:1/1]" style={{ opacity: flip }}>
                  ○ {s.away}
                </span>
              </span>
            </div>

            <p
              aria-hidden="true"
              className="relative mt-10 text-[clamp(1.5rem,5vw,3rem)] leading-snug font-[900] whitespace-pre-line sm:mt-14"
            >
              {closingChars.map((c, i) =>
                c === '\n' ? (
                  <br key={i} />
                ) : (
                  <span key={i} style={{ opacity: mix(0.08, 1, range(p, 0.5 + i * 0.014, 0.58 + i * 0.014)) }}>
                    {c}
                  </span>
                ),
              )}
            </p>

            <div
              className="relative mt-10 sm:mt-12"
              style={{ opacity: cta, transform: `translateY(${(1 - cta) * 20}px)`, pointerEvents: cta > 0.5 ? 'auto' : 'none' }}
            >
              <Link href={s.cta.href} tabIndex={cta > 0.5 ? undefined : -1} className="btn-primary font-[600]">
                <Icon name="headphones" className="size-4" /> {s.cta.label}
              </Link>
            </div>
          </div>
        )
      }}
    </Scene>
  )
}

// ─────────────── 共用：一幕 Scene ／ 捲動進度 ───────────────

/**
 * 一幕：外層高度 = screens 個螢幕高，裡面的畫面黏在螢幕上。
 * children 拿到捲動進度 p（0 = 剛進來，1 = 要離開了）。
 * label 是給螢幕閱讀器念的完整文字（畫面上的動畫字都設成不念）。
 */
export function Scene({ screens, label, children }: { screens: number; label?: string; children: (p: number) => ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const p = useScrollProgress(ref)
  return (
    <section ref={ref} className="relative" style={{ height: `${screens * 100}svh` }}>
      {label && <p className="sr-only">{label}</p>}
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-5 pt-[calc(3.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-8">
        {children(p)}
      </div>
    </section>
  )
}

/** 回傳這一幕捲到哪裡了（0 → 1） */
function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const next = total > 0 ? clamp(-rect.top / total) : 0
      setP((prev) => (Math.abs(prev - next) < 0.0005 ? prev : next))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [ref])
  return p
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])
  return reduced
}

/** 小數學工具 */
const clamp = (v: number) => Math.min(1, Math.max(0, v))
/** p 在 a → b 之間時，從 0 走到 1 */
export const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
/** 緩出：開頭快、結尾慢慢停下 */
export const ease = (t: number) => 1 - Math.pow(1 - t, 3)
export const mix = (a: number, b: number, t: number) => a + (b - a) * t
