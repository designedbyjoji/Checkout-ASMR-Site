import { glossary, triggers } from './site-content'
import { Section, SectionHeading } from './section-heading'

/** ASMR 檔案 ▸ 核心用詞解密 */
export function Glossary() {
  return (
    <Section id="glossary">
      <SectionHeading
        index="01"
        kicker="Glossary"
        title={
          <>
            一種由聲音引起的
            <br />
            <span className="font-serif italic">「酥麻感」</span>
          </>
        }
        lead="ASMR 是「自發性知覺經絡反應」的縮寫。有些人在聽到耳語、輕敲、翻書等細微聲音時，會感到一股從頭皮往後頸蔓延的酥麻，同時變得放鬆、想睡。不是每個人都會有感覺——這也是它有趣的地方。"
      />

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {glossary.map((item, i) => (
          <article
            key={item.term}
            className="glass reveal group rounded-3xl p-6 transition-transform duration-700 hover:-translate-y-1 sm:p-7"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <p className="font-serif text-4xl text-mist italic transition-colors duration-500 group-hover:text-aurora-mint">
              {item.term}
            </p>
            <p className="mt-1 text-xs tracking-[0.3em] text-mist/45">{item.zh}</p>
            <p className="mt-6 text-sm leading-7 text-mist/65">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="reveal mt-16 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
        <p className="kicker shrink-0">常見觸發音</p>
        <ul className="flex flex-wrap gap-2">
          {triggers.map((t) => (
            <li key={t} className="rounded-full border border-white/10 px-4 py-2 text-sm text-mist/70">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
