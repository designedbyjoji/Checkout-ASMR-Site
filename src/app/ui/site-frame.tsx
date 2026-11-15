'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { siteNav, site } from './site-content'
import { CheckoutLogo, Icon } from './shared'
import { chime, getAudioContext } from '@/lib/synth'

/**
 * 全站外框：頁首、頁尾、極光背景、耳機測試、捲動淡入
 */

// ─────────────── 頁首 Header ───────────────

/**
 * ================================================================
 * Header（每一頁最上方）
 * 選單項目在 site-content.ts 的 siteNav 修改
 * ================================================================
 */
export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 換頁時自動關閉手機選單
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ${
          scrolled || open ? 'bg-night/60 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-24 sm:px-8">
          <Link href="/" aria-label="Checkout. 回到首頁">
            <CheckoutLogo />
          </Link>

          {/* 電腦／平板 */}
          <nav className="hidden items-center gap-2 md:flex lg:gap-6" aria-label="主選單">
            {siteNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold tracking-[0.2em] transition-colors ${
                  isActive(item.href) ? 'text-aurora-mint' : 'text-mist/80 hover:text-mist'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute right-5 bottom-1 left-5 h-px bg-aurora-mint transition-transform duration-500 ${
                    isActive(item.href) ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* 手機 */}
          <button
            className="grid size-11 place-items-center rounded-full border border-white/15 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? '關閉選單' : '開啟選單'}
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </header>

      {/* 手機版全螢幕選單（含子項目） */}
      <div
        className={`fixed inset-0 z-40 overflow-y-auto bg-night/90 backdrop-blur-2xl transition-opacity duration-500 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex min-h-full flex-col justify-center px-8 pt-24 pb-12" aria-label="手機選單">
          {siteNav.map((item, i) => (
            <div
              key={item.href}
              className={`border-b border-white/10 py-6 transition-all duration-700 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : '0ms' }}
            >
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-baseline gap-4 text-3xl font-light tracking-wide ${
                  isActive(item.href) ? 'text-aurora-mint' : ''
                }`}
              >
                <span className="font-serif text-base text-aurora-mint/80 italic">0{i + 1}</span>
                {item.label}
              </Link>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 pl-9">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} onClick={() => setOpen(false)} className="text-sm text-mist/55">
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}

// ─────────────── 頁尾 Footer ───────────────

/**
 * ================================================================
 * Footer（每一頁最下方）
 * 文字在 site-content.ts 的 site 與 siteNav 修改
 * ================================================================
 */
export function Footer() {
  return (
    <footer className="relative z-10 bg-night/80 px-5 pt-4 pb-8 backdrop-blur-sm sm:px-8">
      <div className="mx-auto max-w-7xl border-t border-white/12">
        <div className="grid gap-12 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-8 lg:py-16">
          {/* Logo + 介紹 + IG */}
          <div className="flex flex-col items-start">
            <Link href="/" aria-label="Checkout. 回到首頁">
              <CheckoutLogo size="lg" />
            </Link>
            <p className="mt-6 max-w-[19rem] text-[13px] leading-7 tracking-[0.12em] text-mist/70">{site.tagline}</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="mt-7 grid size-14 place-items-center rounded-2xl border border-white/25 text-mist transition-colors hover:border-aurora-mint hover:text-aurora-mint"
            >
              <Icon name="instagram" className="size-7" />
            </a>
          </div>

          {/* 三個連結欄位 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:contents">
            {siteNav.map((group) => (
              <nav key={group.href} aria-label={group.label}>
                <Link
                  href={group.href}
                  className="text-sm font-semibold tracking-[0.2em] text-aurora-mint transition-opacity hover:opacity-80"
                >
                  {group.footerTitle}
                </Link>
                <ul className="mt-6 flex flex-col gap-5">
                  {group.children.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-base font-semibold tracking-[0.18em] text-mist/90 transition-colors hover:text-aurora-mint sm:text-lg"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="border-t border-white/12 pt-6 text-xs tracking-wide text-mist/55">{site.copyright}</div>
      </div>
    </footer>
  )
}

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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-night/95 px-6 text-center backdrop-blur-2xl transition-opacity duration-[900ms] ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <CheckoutLogo className="absolute top-[max(1.5rem,env(safe-area-inset-top))] text-mist/90" />

      {/* 左右耳示意 */}
      <div className="relative mb-10 flex items-center gap-10 sm:gap-16" aria-hidden="true">
        <EarDot active={step === 'left'} label="L" />
        <div className="relative grid size-24 place-items-center rounded-full border border-white/15 sm:size-28">
          <Icon name="headphones" className="size-10 text-mist/80 sm:size-12" />
          {step === 'intro' && (
            <span className="animate-ping-soft absolute inset-0 rounded-full border border-aurora-mint/40" />
          )}
        </div>
        <EarDot active={step === 'right'} label="R" />
      </div>

      <p className="kicker">Please put on your headphones</p>
      <h1
        id="gate-title"
        className="mt-5 text-[clamp(2.2rem,8vw,4rem)] font-light leading-tight tracking-[0.18em]"
      >
        請戴上耳機
      </h1>
      <p className="mt-5 max-w-sm text-balance text-sm leading-7 text-mist/60" aria-live="polite">
        {step === 'intro' && 'ASMR 的細節藏在左右耳之間。找個安靜的角落，把音量調到舒服的大小。'}
        {step === 'left' && '你應該從「左耳」聽見一聲叮——'}
        {step === 'right' && '接著是「右耳」——'}
        {step === 'done' && '左右都聽到了嗎？準備好了就進來吧。'}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        {step === 'done' ? (
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={close} className="btn-primary">
              進入 Checkout. <Icon name="arrow" className="size-4" />
            </button>
            <button onClick={startTest} className="btn-ghost">
              再測一次
            </button>
          </div>
        ) : (
          <button onClick={startTest} disabled={step !== 'intro'} className="btn-primary disabled:opacity-60">
            {step === 'intro' ? '我戴好了，測試左右聲道' : '播放中⋯'}
          </button>
        )}
        <button onClick={close} className="text-xs tracking-[0.2em] text-mist/40 underline-offset-4 hover:text-mist/70 hover:underline">
          略過，直接進入
        </button>
      </div>
    </div>
  )
}

function EarDot({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`relative grid size-12 place-items-center rounded-full border text-xs font-semibold transition-all duration-700 ${
        active
          ? 'scale-110 border-aurora-mint bg-aurora-mint/15 text-aurora-mint shadow-[0_0_40px_rgb(111_245_200/0.6)]'
          : 'border-white/15 text-mist/40'
      }`}
    >
      {label}
      {active && <span className="animate-ping-soft absolute inset-0 rounded-full border border-aurora-mint/60" />}
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
