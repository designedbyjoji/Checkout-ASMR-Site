import Link from 'next/link'
import { gateways } from './site-content'
import { Icon } from './icon'
import { Section, SectionHeading } from './section-heading'

/** 首頁：三個入口卡片 */
export function Gateways() {
  return (
    <Section id="start">
      <SectionHeading index="—" kicker="Where to start" title="今天想從哪裡開始？" />
      <div className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-20">
        {gateways.map((g, i) => (
          <Link
            key={g.href}
            href={g.href}
            className="glass reveal group flex min-h-56 flex-col rounded-3xl p-7 transition-transform duration-700 hover:-translate-y-1 sm:p-8"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <p className="font-serif text-xl text-aurora-mint/90 italic">{g.en}</p>
            <h3 className="mt-2 text-2xl font-light tracking-wide">{g.title}</h3>
            <p className="mt-4 text-sm leading-7 text-mist/60">{g.body}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm text-mist/70 transition-colors group-hover:text-aurora-mint">
              前往 <Icon name="arrow" className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  )
}
