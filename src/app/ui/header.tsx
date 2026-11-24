'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { site, siteNav } from './site-content'
import { CheckoutLogo, Icon, ThreadsLogo } from './shared'


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
          scrolled || open ? 'bg-[#05081299] shadow-[0_1px_0_#ffffff0f] backdrop-blur-xl' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-24 sm:px-8 lg:max-w-none lg:px-8 xl:px-10">
          <Link href="/" aria-label="Checkout. 回到首頁">
            <CheckoutLogo />
          </Link>

          {/* 電腦／平板：滑鼠移到大分類上，才會展開子分頁的下拉選單 */}
          <nav className="hidden items-center gap-1 md:flex lg:gap-4" aria-label="主選單">
            {siteNav.map((item) => {
              const active = isActive(item.href)
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.children[0].href}
                    aria-haspopup="true"
                    className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-[900] tracking-[0.2em] transition-colors duration-300 group-hover:bg-[#ffffff0f] group-focus-within:bg-[#ffffff0f] lg:px-5 ${
                      active ? 'text-[#6ff5c8]' : 'text-[#e6efeecc] group-hover:text-[#e6efee]'
                    }`}
                  >
                    {item.label}
                    <Icon
                      name="chevron"
                      className="size-3.5 opacity-60 transition-transform duration-500 ease-[var(--ease-calm)] group-hover:rotate-180 group-focus-within:rotate-180"
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute right-4 bottom-1 left-4 h-px bg-[#6ff5c8] transition-transform duration-500 lg:right-5 lg:left-5 ${
                        active ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>

                  {/* 下拉選單（pt-3 是讓滑鼠從標題移到選單時不會中斷） */}
                  <div className="invisible absolute top-full left-0 pt-3 opacity-0 transition-all duration-300 ease-[var(--ease-calm)] group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-52 translate-y-1 rounded-2xl border border-[#ffffff1f] bg-[#0a0f1ef2] p-2 shadow-[0_20px_50px_#00000080] backdrop-blur-xl transition-transform duration-300 ease-[var(--ease-calm)] group-focus-within:translate-y-0 group-hover:translate-y-0">
                      {item.children.map((child) => {
                        const current = pathname === child.href
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={current ? 'page' : undefined}
                              className={`block rounded-xl px-4 py-3 text-sm font-[700] tracking-[0.15em] whitespace-nowrap transition-colors duration-300 hover:bg-[#ffffff0f] focus-visible:bg-[#ffffff0f] ${
                                current ? 'text-[#6ff5c8]' : 'text-[#e6efeeb2] hover:text-[#e6efee]'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* 手機 */}
          <button
            className="grid size-11 place-items-center rounded-full border border-[#ffffff26] md:hidden"
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
        className={`fixed inset-0 z-40 overflow-y-auto bg-[#050812e6] backdrop-blur-2xl transition-opacity duration-500 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex min-h-full flex-col justify-center px-8 pt-24 pb-12" aria-label="手機選單">
          {siteNav.map((item, i) => (
            <div
              key={item.href}
              className={`border-b border-[#ffffff1a] py-6 transition-all duration-700 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : '0ms' }}
            >
              <Link
                href={item.children[0].href}
                onClick={() => setOpen(false)}
                className={`flex items-baseline gap-4 text-3xl font-[300] tracking-wide ${
                  isActive(item.href) ? 'text-[#6ff5c8]' : ''
                }`}
              >
                <span className="font-serif text-base font-[400] text-[#6ff5c8cc] italic">0{i + 1}</span>
                {item.label}
              </Link>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 pl-9">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} onClick={() => setOpen(false)} className="text-sm font-[400] text-[#e6efee8c]">
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 社群按鈕＋版權（手機版沒有 Footer，所以放在這裡） */}
          <div
            className={`pt-10 transition-all duration-700 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: open ? `${120 + siteNav.length * 70}ms` : '0ms' }}
          >
            <div className="flex gap-3">
              {[
                { href: site.instagram, label: 'Instagram', icon: <Icon name="instagram" className="size-6" /> },
                { href: site.threads, label: 'Threads', icon: <ThreadsLogo className="size-5" /> },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-12 place-items-center rounded-2xl border border-[#ffffff40] text-[#e6efee] transition-colors hover:border-[#6ff5c8] hover:text-[#6ff5c8]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs font-[400] tracking-wide text-[#e6efee8c]">{site.copyright}</p>
          </div>
        </nav>
      </div>
    </>
  )
}

