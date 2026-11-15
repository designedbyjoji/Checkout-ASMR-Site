'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CheckoutLogo, Icon } from './shared'
import { chime, getAudioContext } from '@/lib/synth'

/**
 * 全站背景效果（每一頁都有，但不屬於 Header／Footer）：
 * 極光背景、進站耳機測試、捲動淡入
 */

// ─────────────── 極光背景 Aurora ───────────────

/** 固定在畫面最底層的極光背景；往下捲動時慢慢變暗，讓內容更好讀。 */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const progress = Math.min(window.scrollY / (window.innerHeight * 1.2), 1)
      el.style.setProperty('--veil', String(progress * 0.35))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="aurora" aria-hidden="true">
      <div className="aurora__stars" />
      <div className="aurora__ribbon aurora__ribbon--1" />
      <div className="aurora__ribbon aurora__ribbon--2" />
      <div className="aurora__ribbon aurora__ribbon--3" />
      <div className="aurora__bands" />
      <div className="aurora__shade" />
      <div className="aurora__veil" />
      <div className="aurora__grain" />
    </div>
  )
}

// ─────────────── 進站耳機測試 HeadphoneGate ───────────────

type Step = 'intro' | 'left' | 'right' | 'done'

const STORAGE_KEY = 'checkout:gate-passed'

/**
 * 「請戴上耳機」入口。
 * 點一下按鈕，左耳、右耳依序響起提示音，確認耳機戴對。
 * 這一下點擊同時也「解鎖」了手機瀏覽器的聲音（瀏覽器規定要使用者先點過才能出聲）。
 */
export function HeadphoneGate() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [step, setStep] = useState<Step>('intro')

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== '1') setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  function close() {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* 無痕模式可能不能存 */
    }
    setLeaving(true)
    window.setTimeout(() => setVisible(false), 900)
  }

  function startTest() {
    getAudioContext()
    setStep('left')
    chime('left')
    window.setTimeout(() => {
      setStep('right')
      chime('right')
    }, 1300)
    window.setTimeout(() => setStep('done'), 2600)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#050812f2] px-6 text-center backdrop-blur-2xl transition-opacity duration-[900ms] ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <CheckoutLogo className="absolute top-[max(1.5rem,env(safe-area-inset-top))] text-[#e6efeee6]" />

      {/* 左右耳示意 */}
      <div className="relative mb-10 flex items-center gap-10 sm:gap-16" aria-hidden="true">
        <EarDot active={step === 'left'} label="L" />
        <div className="relative grid size-24 place-items-center rounded-full border border-[#ffffff26] sm:size-28">
          <Icon name="headphones" className="size-10 text-[#e6efeecc] sm:size-12" />
          {step === 'intro' && (
            <span className="animate-ping-soft absolute inset-0 rounded-full border border-[#6ff5c866]" />
          )}
        </div>
        <EarDot active={step === 'right'} label="R" />
      </div>

      <p className="kicker font-[600]">Please put on your headphones</p>
      <h1
        id="gate-title"
        className="mt-5 text-[clamp(2.2rem,8vw,4rem)] font-[300] leading-tight tracking-[0.18em]"
      >
        請戴上耳機
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-7 text-balance font-[400] text-[#e6efee99]" aria-live="polite">
        {step === 'intro' && 'ASMR 的細節藏在左右耳之間。找個安靜的角落，把音量調到舒服的大小。'}
        {step === 'left' && '你應該從「左耳」聽見一聲叮——'}
        {step === 'right' && '接著是「右耳」——'}
        {step === 'done' && '左右都聽到了嗎？準備好了就進來吧。'}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        {step === 'done' ? (
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={close} className="btn-primary font-[600]">
              進入 Checkout. <Icon name="arrow" className="size-4" />
            </button>
            <button onClick={startTest} className="btn-ghost font-[500]">
              再測一次
            </button>
          </div>
        ) : (
          <button onClick={startTest} disabled={step !== 'intro'} className="btn-primary font-[600] disabled:opacity-60">
            {step === 'intro' ? '我戴好了，測試左右聲道' : '播放中⋯'}
          </button>
        )}
        <button onClick={close} className="text-xs font-[400] tracking-[0.2em] text-[#e6efee66] underline-offset-4 hover:text-[#e6efeeb2] hover:underline">
          略過，直接進入
        </button>
      </div>
    </div>
  )
}

function EarDot({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`relative grid size-12 place-items-center rounded-full border text-xs font-[600] transition-all duration-700 ${
        active
          ? 'scale-110 border-[#6ff5c8] bg-[#6ff5c826] text-[#6ff5c8] shadow-[0_0_40px_#6ff5c899]'
          : 'border-[#ffffff26] text-[#e6efee66]'
      }`}
    >
      {label}
      {active && <span className="animate-ping-soft absolute inset-0 rounded-full border border-[#6ff5c899]" />}
    </span>
  )
}

// ─────────────── 捲動淡入效果 RevealObserver ───────────────

/** 讓有 .reveal 的元素捲進畫面時淡入；每次換頁都重新掃描一次 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    const scan = () =>
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el))
    scan()
    // 有些內容是之後才出現的（例如測驗結果），也一起照顧到
    const mutations = new MutationObserver(scan)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [pathname])

  return null
}
