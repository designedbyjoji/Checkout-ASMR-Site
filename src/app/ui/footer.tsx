import Link from 'next/link'
import { site, siteNav } from './site-content'
import { CheckoutLogo, Icon, ThreadsLogo } from './shared'


/**
 * ================================================================
 * Footer（每一頁最下方）
 * 文字在 site-content.ts 的 site 與 siteNav 修改
 * 手機版（md 以下）不顯示：頁面連結已在漢堡選單，社群按鈕與版權文字也移到選單最下方（header.tsx）
 * ================================================================
 */
export function Footer() {
  return (
    <footer className="relative z-10 hidden bg-[#050812cc] px-5 pt-4 pb-8 backdrop-blur-sm sm:px-8 xl:px-10 md:block">
      {/* 寬度與左右留白跟 Header 一致，讓 Logo 和連結欄位對齊 Header */}
      <div className="mx-auto max-w-7xl border-t lg:max-w-none border-[#ffffff1f]">
        <div className="grid gap-12 py-14 md:flex md:items-start md:justify-between md:gap-8 lg:py-16">
          {/* Logo + 介紹 + 社群按鈕（IG、Threads） */}
          <div className="flex flex-col items-start">
            <Link href="/" aria-label="Checkout. 回到首頁">
              <CheckoutLogo size="lg" />
            </Link>
            <p className="mt-6 max-w-[19rem] text-[13px] leading-7 font-[400] tracking-[0.12em] text-[#e6efeeb2]">{site.tagline}</p>
            <div className="mt-7 flex gap-3">
              {[
                { href: site.instagram, label: 'Instagram', icon: <Icon name="instagram" className="size-7" /> },
                { href: site.threads, label: 'Threads', icon: <ThreadsLogo className="size-6" /> },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-14 place-items-center rounded-2xl border border-[#ffffff40] text-[#e6efee] transition-colors hover:border-[#6ff5c8] hover:text-[#6ff5c8]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 三個連結欄位 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:flex md:gap-12 lg:gap-20 lg:pr-5 xl:gap-28">
            {siteNav.map((group) => (
              <nav key={group.href} aria-label={group.label}>
                <Link
                  href={group.children[0].href}
                  className="text-sm font-[900] tracking-[0.2em] text-[#6ff5c8] transition-opacity hover:opacity-80"
                >
                  {group.footerTitle}
                </Link>
                <ul className="mt-6 flex flex-col gap-5">
                  {group.children.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-base font-[700] tracking-[0.18em] text-[#e6efeee6] transition-colors hover:text-[#6ff5c8] sm:text-lg"
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

        <div className="border-t border-[#ffffff1f] pt-6 text-xs font-[400] tracking-wide text-[#e6efee8c]">{site.copyright}</div>
      </div>
    </footer>
  )
}

