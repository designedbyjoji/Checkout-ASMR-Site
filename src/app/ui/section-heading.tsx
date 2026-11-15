/** 每個段落開頭的標題（編號 ─ 英文小標 ／ 大標題 ／ 導言） */
export function SectionHeading({
  index,
  kicker,
  title,
  lead,
}: {
  index: string
  kicker: string
  title: React.ReactNode
  lead?: string
}) {
  return (
    <div className="reveal max-w-3xl">
      <p className="kicker flex items-center gap-3">
        <span className="font-serif text-base tracking-normal text-aurora-mint/90 normal-case italic">{index}</span>
        <span className="h-px w-8 bg-white/20" />
        {kicker}
      </p>
      <h2 className="mt-6 text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.15] font-light tracking-[0.02em] whitespace-pre-line">
        {title}
      </h2>
      {lead && <p className="mt-6 max-w-2xl text-base leading-8 text-mist/65 sm:text-lg">{lead}</p>}
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

/** 內頁最上方的頁面標題 */
export function PageIntro({ en, title, lead }: { en: string; title: string; lead: string }) {
  return (
    <header className="relative px-5 pt-36 pb-6 sm:px-8 sm:pt-44 lg:pt-52">
      <div className="mx-auto max-w-7xl">
        <p className="reveal font-serif text-xl text-aurora-mint/90 italic sm:text-2xl">{en}</p>
        <h1 className="reveal mt-3 text-[clamp(2.8rem,9vw,6rem)] leading-[1.05] font-light tracking-[0.04em]">
          {title}
        </h1>
        <p className="reveal mt-8 max-w-2xl text-base leading-8 text-mist/65 sm:text-lg">{lead}</p>
      </div>
    </header>
  )
}
