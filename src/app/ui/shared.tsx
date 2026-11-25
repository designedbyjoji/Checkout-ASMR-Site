import Link from 'next/link'
import logo from '@/imports/checkout-logo.svg'
import threadsLogo from '@/imports/threads-logo.svg'
import { siteNav } from './site-content'

/**
 * 共用小零件：圖示、Logo、區塊標題、小波形
 */

// ─────────────── 圖示 Icon ───────────────

const paths = {
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  down: (
    <>
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </>
  ),
  heart: <path d="M19.5 12.6 12 20l-7.5-7.4A4.9 4.9 0 0 1 12 6.1a4.9 4.9 0 0 1 7.5 6.5Z" />,
  menu: (
    <>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </>
  ),
  pause: (
    <>
      <path d="M9 5v14" />
      <path d="M15 5v14" />
    </>
  ),
  play: (
    <path d="M8 5.5v13a.5.5 0 0 0 .77.42l10.2-6.5a.5.5 0 0 0 0-.84L8.77 5.08A.5.5 0 0 0 8 5.5Z" />
  ),
  share: (
    <>
      <path d="M12 15V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  headphones: (
    <>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4.5" height="6.5" rx="2" />
      <rect x="16.5" y="14" width="4.5" height="6.5" rx="2" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M20.5 12a8.5 8.5 0 1 1-2.5-6" />
      <path d="M18 2.5V6h-3.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5Z" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
} as const

export type IconName = keyof typeof paths

export function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

// ─────────────── Logo ───────────────

/**
 * Checkout. 標誌
 * ------------------------------------------------------------
 * 圖案來自 src/imports/checkout-logo.svg —— 換掉那個檔案，全站 Logo 就會一起更新。
 * 用「遮罩」的方式顯示：不管 SVG 原本是什麼顏色，都會被染成目前的文字顏色。
 *
 * 如果你的 SVG 已經包含「Checkout.」字樣，把下面改成 true，避免文字重複。
 */
const LOGO_HAS_WORDMARK = true

/** Threads Logo（檔案在 src/imports/threads-logo.svg），顏色會跟著文字顏色走 */
export function ThreadsLogo({ className = 'size-6' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-current ${className}`}
      style={{
        WebkitMaskImage: `url(${threadsLogo.src})`,
        maskImage: `url(${threadsLogo.src})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

export function CheckoutLogo({
  className = '',
  size = 'md',
}: {
  className?: string
  /** xs：聲音卡片角落的小 Logo · md：Header · lg：Footer、沒有封面時的預設封面 */
  size?: 'xs' | 'md' | 'lg'
}) {
  const height = size === 'lg' ? 'h-11 sm:h-12' : size === 'xs' ? 'h-3.5' : 'h-8 sm:h-9'
  const ratio = logo.width && logo.height ? logo.width / logo.height : 74 / 58

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden={!LOGO_HAS_WORDMARK}
        role={LOGO_HAS_WORDMARK ? 'img' : undefined}
        aria-label={LOGO_HAS_WORDMARK ? 'Checkout.' : undefined}
        className={`block shrink-0 bg-current ${height}`}
        style={{
          aspectRatio: String(ratio),
          WebkitMaskImage: `url(${logo.src})`,
          maskImage: `url(${logo.src})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
      {!LOGO_HAS_WORDMARK && (
        <span
          className={`font-display font-[600] tracking-[-0.03em] ${
            size === 'lg' ? 'text-[28px] sm:text-[32px]' : 'text-[22px] sm:text-2xl'
          }`}
        >
          Checkout.
        </span>
      )}
    </span>
  )
}

// ─────────────── 區塊標題 SectionHeading／頁面開頭 PageIntro ───────────────

/**
 * 每個段落開頭的標題（大標題 ／ 導言）
 * weight：文字粗細，由使用這個標題的頁面自己決定，
 *     例如 weight={{ title: 900, lead: 700 }}（全站標準，跟「關於我們」一致）
 *     數字越大越粗：100 最細 · 300 細 · 400 一般 · 500 中 · 600 粗 · 900 最粗
 */
export function SectionHeading({
  weight,
  title,
  lead,
}: {
  weight: { title: number; lead?: number }
  title: React.ReactNode
  lead?: string
}) {
  return (
    <div className="reveal max-w-3xl">
      <h2
        className="text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.15] tracking-[0.02em] whitespace-pre-line"
        style={{ fontWeight: weight.title }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className="mt-6 max-w-2xl text-base leading-8 text-[#e6efeea6] sm:text-lg"
          style={{ fontWeight: weight.lead }}
        >
          {lead}
        </p>
      )}
    </div>
  )
}

/** 段落外框：統一上下留白與最大寬度 */
export function Section({
  id,
  children,
  className = '',
}: {
  id?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`relative px-5 py-24 sm:px-8 lg:py-36 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

/**
 * 內頁最上方的頁面標題
 * weight：文字粗細，由使用這個標題的頁面自己決定，
 *     例如 weight={{ en: 400, title: 700, lead: 700 }}（全站標準，跟「關於我們」一致）
 */
export function PageIntro({
  en,
  title,
  lead,
  weight,
}: {
  en: string
  title: string
  lead: string
  weight: { en: number; title: number; lead: number }
}) {
  return (
    <header className="relative px-5 pt-36 pb-6 sm:px-8 sm:pt-44 lg:pt-52">
      <div className="mx-auto max-w-7xl">
        <p
          className="reveal font-serif text-xl text-[#6ff5c8e6] italic sm:text-2xl"
          style={{ fontWeight: weight.en }}
        >
          {en}
        </p>
        <h1
          className="reveal mt-3 text-[clamp(2.8rem,9vw,6rem)] leading-[1.05] tracking-[0.04em]"
          style={{ fontWeight: weight.title }}
        >
          {title}
        </h1>
        <p
          className="reveal mt-8 max-w-2xl text-base leading-8 text-[#e6efeea6] sm:text-lg"
          style={{ fontWeight: weight.lead }}
        >
          {lead}
        </p>
      </div>
    </header>
  )
}

// ─────────────── 子分頁外框 Subpage ───────────────

/**
 * 每個子分頁（例如 /about/team）共用的外框：
 * 下方＝上一頁／下一頁（子分頁之間主要靠 Header 下拉選單切換）。
 * 子分頁的名稱與順序都來自 site-content.ts 的 siteNav。
 */
export function Subpage({ href, children }: { href: string; children: React.ReactNode }) {
  const group = siteNav.find((g) => g.children.some((c) => c.href === href))
  if (!group) return <>{children}</>
  const pages = group.children
  const index = pages.findIndex((c) => c.href === href)
  const current = pages[index]
  const prev = pages[index - 1]
  const next = pages[index + 1]

  return (
    <>
      {/* 頁面標題只給螢幕閱讀器用；上方留白讓內容不會被固定的 Header 蓋住 */}
      <h1 className="sr-only">
        {group.label}：{current.label}
      </h1>
      <div className="pt-[calc(3rem+env(safe-area-inset-top))] sm:pt-[calc(5rem+env(safe-area-inset-top))] lg:pt-[calc(3rem+env(safe-area-inset-top))]">
        {children}
      </div>

      {(prev || next) && (
        <nav aria-label="上一頁／下一頁" className="relative px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-[#ffffff1a] pt-8 sm:flex-row sm:justify-between">
            {prev ? (
              <Link
                href={prev.href}
                className="group flex flex-col gap-1 text-[#e6efeeb2] transition-colors hover:text-[#6ff5c8]"
              >
                <span className="text-xs font-[400] tracking-[0.3em] text-[#e6efee73]">上一頁</span>
                <span className="inline-flex items-center gap-2 text-lg font-[600] tracking-[0.1em]">
                  <Icon
                    name="arrow"
                    className="size-4 rotate-180 transition-transform duration-500 group-hover:-translate-x-1"
                  />
                  {prev.label}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={next.href}
                className="group flex flex-col gap-1 text-[#e6efeeb2] transition-colors hover:text-[#6ff5c8] sm:items-end"
              >
                <span className="text-xs font-[400] tracking-[0.3em] text-[#e6efee73]">下一頁</span>
                <span className="inline-flex items-center gap-2 text-lg font-[600] tracking-[0.1em]">
                  {next.label}
                  <Icon
                    name="arrow"
                    className="size-4 transition-transform duration-500 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  )
}

// ─────────────── 播放中的小波形 MiniWave ───────────────

/** 小小的聲波動畫（播放中會跳動） */
export function MiniWave({
  active,
  className = 'text-[#6ff5c8b2]',
}: {
  active: boolean
  className?: string
}) {
  const bars = [40, 70, 45, 90, 55, 80, 35, 65, 50, 75, 40, 60]
  return (
    <span className={`flex h-6 items-center gap-[3px] ${className}`} aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`block w-[2px] rounded-full bg-current transition-opacity ${active ? 'animate-wave opacity-100' : 'opacity-30'}`}
          style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
        />
      ))}
    </span>
  )
}
