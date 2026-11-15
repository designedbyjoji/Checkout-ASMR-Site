'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from '../ui/Icon'

/** 首屏：中間有一顆跟著呼吸節奏縮放的光球（吸 4 秒、吐 4 秒）。 */
export function Hero() {
  const [inhale, setInhale] = useState(true)

  useEffect(() => {
    const id = window.setInterval(() => setInhale((v) => !v), 4000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-20 pb-28">
      {/* 呼吸光球 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[min(78vw,520px)] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="size-full rounded-full transition-transform duration-[4000ms] ease-in-out"
          style={{
            transform: `scale(${inhale ? 1.06 : 0.82})`,
            background:
              'radial-gradient(circle at 35% 30%, rgb(111 245 200 / 0.35), rgb(76 201 255 / 0.18) 40%, rgb(160 132 255 / 0.12) 65%, transparent 72%)',
            filter: 'blur(8px)',
          }}
        />
        <div
          className="absolute inset-[18%] rounded-full border border-white/10 transition-transform duration-[4000ms] ease-in-out"
          style={{ transform: `scale(${inhale ? 1.08 : 0.9})` }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="kicker reveal !tracking-[0.18em] sm:!tracking-[0.28em]">Autonomous Sensory Meridian Response</p>
        <h1 className="reveal mt-7 text-[clamp(2.6rem,9vw,6.2rem)] leading-[1.08] font-light tracking-[0.04em]">
          把世界
          <br className="sm:hidden" />
          <span className="aurora-text font-normal">調小聲</span>一點
        </h1>
        <p className="reveal mx-auto mt-8 max-w-xl text-[clamp(1rem,2.4vw,1.25rem)] leading-relaxed text-mist/70">
          這裡沒有演算法，只有頭皮發麻。
          <br />
          一個收藏、理解與分享 ASMR 的聲音角落。
        </p>

        <div className="reveal mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/experience#match" className="btn-primary w-full max-w-64 sm:w-auto">
            <Icon name="headphones" className="size-4" /> 開始體驗
          </Link>
          <Link href="/archive" className="btn-ghost w-full max-w-64 sm:w-auto">
            什麼是 ASMR？
          </Link>
        </div>

        <p className="mt-14 text-xs tracking-[0.4em] text-mist/40" aria-live="off">
          <span className="transition-opacity duration-700">{inhale ? '吸 氣 ⋯' : '吐 氣 ⋯'}</span>
        </p>
      </div>

      <a
        href="#start"
        aria-label="往下捲動"
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-white/15 text-mist/60 transition-colors hover:text-mist"
      >
        <Icon name="down" className="size-4" />
      </a>
    </section>
  )
}
