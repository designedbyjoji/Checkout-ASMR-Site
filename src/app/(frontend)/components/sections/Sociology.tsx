import { sociology } from '../../content'
import { Section, SectionHeading } from '../ui/SectionHeading'

/** ASMR 檔案 ▸ 社會學洞察 */
export function Sociology() {
  return (
    <Section id="sociology">
      <SectionHeading
        index="03"
        kicker="Sociological insight"
        title={
          <>
            為什麼我們
            <br />
            願意為「安靜」買單？
          </>
        }
        lead="從消費文化的角度看 ASMR，它不只是一種聲音，更反映了現代人怎麼面對疲憊、孤獨與注意力。"
      />

      <div className="mt-16 grid gap-4 md:grid-cols-2 lg:mt-20">
        {sociology.map((item, i) => (
          <article
            key={item.keyword}
            className="glass reveal relative overflow-hidden rounded-3xl p-6 sm:p-9"
            style={{ transitionDelay: `${(i % 2) * 100}ms` }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 -right-2 font-serif text-[5.5rem] leading-none text-white/[0.04] italic select-none sm:text-[7rem]"
            >
              {item.keyword}
            </span>
            <p className="font-serif text-lg text-aurora-mint/90 italic">
              0{i + 1} · {item.keyword}
            </p>
            <h3 className="mt-4 text-xl font-medium tracking-wide sm:text-2xl">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-mist/65 sm:text-base sm:leading-8">{item.body}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
