'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { siteNav } from './site-content'
import { CheckoutLogo } from './checkout-logo'
import { Icon } from './icon'

/**
 * ================================================================
 * Header（每一頁最上方）
 * 選單項目在 content.ts 的 siteNav 修改
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
