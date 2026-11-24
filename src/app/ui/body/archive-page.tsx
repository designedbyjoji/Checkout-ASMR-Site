import { Section, SectionHeading, Subpage } from '../shared'
import { glossary, asmrTypeGroups, timeline, sociology } from '../site-content'

/**
 * ASMR 檔案：每個子分頁都是獨立的一頁
 *   /archive/glossary 核心用詞解密、/archive/types ASMR 類型、
 *   /archive/history 歷史發展、/archive/sociology 社會學洞察
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

/** /archive/types ASMR 類型 */
export function TypesPage() {
  return (
    <Subpage href="/archive/types">
      <AsmrTypes />
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
            <p className="font-serif text-4xl leading-tight font-[400] text-balance text-[#e6efee] italic transition-colors duration-500 group-hover:text-[#6ff5c8]">
              {item.term}
            </p>
            <p className="mt-1 text-xs font-[400] tracking-[0.3em] text-[#e6efee73]">{item.zh}</p>
            <p className="mt-6 text-sm leading-7 font-[400] text-[#e6efeea6]">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

// ─────────────── 五種子類型 ASMR Types ───────────────

/** ASMR 檔案 ▸ ASMR 類型 */
export function AsmrTypes() {
  return (
    <Section id="types">
      <SectionHeading
        weight={{ index: 700, kicker: 700, title: 900, lead: 700 }}
        index="02"
        kicker="Five styles"
        title={
          <>
            五種 ASMR，
            <br />
            兩個面向
          </>
        }
        lead="同一支影片，可以有一種聲音來源，再加上一種呈現方式。"
      />

      {asmrTypeGroups.map((group, g) => (
        <div key={group.label} className={g === 0 ? 'mt-16 lg:mt-20' : 'mt-14 lg:mt-16'}>
          <p className="reveal kicker flex items-center gap-3 font-[600]">
            {group.label}
            <span className="h-px w-8 bg-[#ffffff33]" />
            <span className="tracking-[0.2em] text-[#e6efee66]">{group.question}</span>
          </p>

          <div className={`mt-6 grid gap-4 sm:grid-cols-2 ${group.types.length === 3 ? 'lg:grid-cols-3' : ''}`}>
            {group.types.map((type, i) => (
              <article
                key={type.name}
                className="glass reveal flex flex-col items-center rounded-3xl px-6 py-10 text-center sm:py-12"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span
                  className="grid size-24 place-items-center rounded-full"
                  style={{ color: type.color, backgroundColor: `${type.color}14`, boxShadow: `0 0 48px ${type.color}26` }}
                >
                  <TypeIcon name={type.icon} />
                </span>
                <p className="mt-7 font-serif text-base font-[400] text-[#e6efee80] italic">{type.en}</p>
                <h3 className="mt-1 text-3xl font-[700] tracking-[0.08em]">{type.name}</h3>
                <p className="mt-4 text-base leading-7 font-[400] whitespace-pre-line text-[#e6efeea6]">{type.line}</p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </Section>
  )
}

/**
 * 五種類型的動畫圖示（純 SVG + CSS，動畫寫在 styles.css 的「ASMR 類型圖示」）
 * 開啟「減少動態效果」時會停在靜止畫面。
 */
function TypeIcon({ name }: { name: (typeof asmrTypeGroups)[number]['types'][number]['icon'] }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className={`type-icon type-icon--${name} size-14`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'mouth' && (
        <>
          {/* 嘴唇 + 往右飄的氣音 */}
          <path d="M5 24C9 19 12.5 17.5 14.5 19.5Q16 20.6 17.5 19.5C19.5 17.5 23 19 27 24" />
          <path d="M5 24C10 30.5 22 30.5 27 24" />
          <path d="M5 24C11 25.5 21 25.5 27 24" />
          <path className="breath breath-1" d="M32 20Q34.5 24 32 28" />
          <path className="breath breath-2" d="M36.5 16.5Q40.5 24 36.5 31.5" />
          <path className="breath breath-3" d="M41 13Q46.5 24 41 35" />
        </>
      )}
      {name === 'tap' && (
        <>
          {/* 指尖輕敲木塊，敲下去時泛起漣漪 */}
          <rect x="7" y="33" width="34" height="8" rx="2.5" />
          <path className="finger" d="M20 4V21a4 4 0 0 0 8 0V4" />
          <path className="ripple ripple-l" d="M15 29l-4-3" />
          <path className="ripple ripple-r" d="M33 29l4-3" />
        </>
      )}
      {name === 'rain' && (
        <>
          {/* 雲 + 落下的雨滴 */}
          <path d="M15 27H34a6 6 0 0 0 .5-12A9 9 0 0 0 17.5 13.5A7 7 0 0 0 15 27Z" />
          <path className="drop drop-1" d="M18 32v4" />
          <path className="drop drop-2" d="M24.5 33v4" />
          <path className="drop drop-3" d="M31 32v4" />
        </>
      )}
      {name === 'roleplay' && (
        <>
          {/* 一個人 + 對話框裡輪流亮起的小點 */}
          <circle cx="16" cy="20" r="5.5" />
          <path d="M5 40C5 32.5 10 28.5 16 28.5S27 32.5 27 40" />
          <rect x="25" y="6" width="18" height="12" rx="6" />
          <circle className="dot dot-1" cx="29.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle className="dot dot-2" cx="34" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle className="dot dot-3" cx="38.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
        </>
      )}
      {name === 'eye' && (
        <>
          {/* 眼睛跟著光慢慢移動 */}
          <path d="M4 24C10 14 38 14 44 24C38 34 10 34 4 24Z" />
          <g className="iris">
            <circle cx="24" cy="24" r="6" />
            <circle cx="24" cy="24" r="2.2" fill="currentColor" stroke="none" />
          </g>
          <path className="sparkle" d="M41 5v5M38.5 7.5h5" />
        </>
      )}
    </svg>
  )
}

// ─────────────── 時間軸 Timeline ───────────────

/** ASMR 檔案 ▸ 歷史發展 */
export function Timeline() {
  return (
    <Section id="history">
      <SectionHeading
        weight={{ index: 700, kicker: 700, title: 900}}
        index="03"
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
        index="04"
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
