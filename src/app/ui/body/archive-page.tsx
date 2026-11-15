import { Section, SectionHeading, Subpage } from '../shared'
import { glossary, triggers, timeline, sociology } from '../site-content'

/**
 * ASMR 檔案：每個子分頁都是獨立的一頁
 *   /archive/glossary 核心用詞解密、/archive/history 歷史發展、/archive/sociology 社會學洞察
 *   （網址 /archive 會自動跳到第一個子分頁）
 */

// ─────────────── ASMR 檔案的子分頁 ───────────────

/** /archive/glossary 核心用詞解密 */
export function GlossaryPage() {
  return (
    <Subpage href="/archive/glossary">
      <Glossary />
    </Subpage>
  )
}

/** /archive/history 歷史發展 */
export function HistoryPage() {
  return (
    <Subpage href="/archive/history">
      <Timeline />
    </Subpage>
  )
}

/** /archive/sociology 社會學洞察 */
export function SociologyPage() {
  return (
    <Subpage href="/archive/sociology">
      <Sociology />
    </Subpage>
  )
}

// ─────────────── 名詞小辭典 Glossary ───────────────

/** ASMR 檔案 ▸ 核心用詞解密 */
export function Glossary() {
  return (
    <Section id="glossary">
      <SectionHeading
        weight={{ index: 700, kicker: 700, title: 900, lead: 700 }}
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
            <p className="font-serif text-4xl font-[400] text-[#e6efee] italic transition-colors duration-500 group-hover:text-[#6ff5c8]">
              {item.term}
            </p>
            <p className="mt-1 text-xs font-[400] tracking-[0.3em] text-[#e6efee73]">{item.zh}</p>
            <p className="mt-6 text-sm leading-7 font-[400] text-[#e6efeea6]">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="reveal mt-16 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
        <p className="kicker shrink-0 font-[600]">常見觸發音</p>
        <ul className="flex flex-wrap gap-2">
          {triggers.map((t) => (
            <li key={t} className="rounded-full border border-[#ffffff1a] px-4 py-2 text-sm font-[400] text-[#e6efeeb2]">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

// ─────────────── 時間軸 Timeline ───────────────

/** ASMR 檔案 ▸ 歷史發展 */
export function Timeline() {
  return (
    <Section id="history">
      <SectionHeading
        weight={{ index: 700, kicker: 700, title: 900}}
        index="02"
        kicker="A short history"
        title={
          <>
            從一篇討論串，
            <br />
            到一種聲音文化
          </>
        }
      />

      <ol className="relative mt-16 lg:mt-24">
        {/* 中軸線 */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-[#6ff5c899] via-[#a084ff66] to-transparent md:left-1/2"
        />
        {timeline.map((item, i) => {
          const right = i % 2 === 1
          return (
            <li
              key={item.year}
              className={`reveal relative mb-14 pl-10 last:mb-0 md:mb-20 md:w-1/2 md:pl-0 ${
                right ? 'md:ml-auto md:pl-16' : 'md:pr-16 md:text-right'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-3 left-0 size-[15px] rounded-full border-2 border-[#050812] bg-[#6ff5c8] shadow-[0_0_20px_#6ff5c8cc] md:top-4 ${
                  right ? 'md:-left-[7.5px]' : 'md:right-[-7.5px] md:left-auto'
                }`}
              />
              <p className="font-serif text-5xl font-[400] text-[#e6efeee6] italic sm:text-6xl">{item.year}</p>
              <h3 className="mt-3 text-xl font-[500] tracking-wide">{item.title}</h3>
              <p
                className={`mt-3 max-w-md text-sm leading-7 font-[400] text-[#e6efee99] sm:text-base sm:leading-8 ${right ? '' : 'md:ml-auto'}`}
              >
                {item.body}
              </p>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}

// ─────────────── 社會學觀察 Sociology ───────────────

/** ASMR 檔案 ▸ 社會學洞察 */
export function Sociology() {
  return (
    <Section id="sociology">
      <SectionHeading
        weight={{ index: 700, kicker: 700, title: 900, lead: 700 }}
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
              className="pointer-events-none absolute -top-4 -right-2 font-serif text-[5.5rem] leading-none font-[400] text-[#ffffff0a] italic select-none sm:text-[7rem]"
            >
              {item.keyword}
            </span>
            <p className="font-serif text-lg font-[400] text-[#6ff5c8e6] italic">
              0{i + 1} · {item.keyword}
            </p>
            <h3 className="mt-4 text-xl font-[500] tracking-wide sm:text-2xl">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 font-[400] text-[#e6efeea6] sm:text-base sm:leading-8">{item.body}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
