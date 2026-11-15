import Link from 'next/link'
import { site, siteNav } from './site-content'
import { CheckoutLogo } from './checkout-logo'
import { Icon } from './icon'

/**
 * ================================================================
 * Footer（每一頁最下方）
 * 文字在 content.ts 的 site 與 siteNav 修改
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
