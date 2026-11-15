import { Section, SectionHeading, Subpage } from '../shared'
import { mission, team } from '../site-content'

/**
 * 關於我們：每個子分頁都是獨立的一頁
 *   /about/mission 創立初衷、/about/team 團隊成員名單
 *   （網址 /about 會自動跳到第一個子分頁）
 */

// ─────────────── 關於我們的子分頁 ───────────────

/** /about/mission 創立初衷 */
export function MissionPage() {
  return (
    <Subpage href="/about/mission">
      <Mission />
    </Subpage>
  )
}

/** /about/team 團隊成員名單 */
export function TeamPage() {
  return (
    <Subpage href="/about/team">
      <Team />
    </Subpage>
  )
}

// ─────────────── 理念 Mission／團隊 Team ───────────────

/** 關於我們 ▸ 創立初衷 */
export function Mission() {
  return (
    <Section id="mission">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <SectionHeading weight={{ index: 700, kicker: 700, title: 900 }} index="01" kicker="Our mission" title={mission.title} />
        <div className="flex flex-col gap-6 lg:pt-16">
          {mission.paragraphs.map((p, i) => (
            <p
              key={i}
              className="reveal text-base leading-8 font-[400] text-[#e6efeeb2] sm:text-lg sm:leading-9"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}

/** 關於我們 ▸ 團隊成員名單 */
export function Team() {
  const gradients = [
    'from-[#6ff5c8] to-[#4cc9ff]',
    'from-[#4cc9ff] to-[#a084ff]',
    'from-[#a084ff] to-[#ff9ad5]',
    'from-[#ff9ad5] to-[#6ff5c8]',
  ]
  return (
    <Section id="team">
      <SectionHeading
        weight={{ index: 700, kicker: 700, title: 900, lead: 700 }}
        index="02"
        kicker="The team"
        title="團隊成員名單"
        lead="一群在期末壓力中，比誰都更需要 ASMR 的學生。"
      />
      <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:mt-20 lg:grid-cols-5">
        {team.map((member, i) => (
          <li
            key={member.name}
            className="glass reveal flex flex-col items-center rounded-3xl px-4 py-8 text-center sm:px-6"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span
              aria-hidden="true"
              className={`grid size-16 place-items-center rounded-full bg-gradient-to-br text-xl font-[500] text-[#050812] sm:size-20 sm:text-2xl ${
                gradients[i % gradients.length]
              }`}
            >
              {member.name.replace(/^成員\s*/, '').slice(0, 1)}
            </span>
            <p className="mt-5 text-base font-[500]">{member.name}</p>
            <p className="mt-1 text-xs font-[400] tracking-wide text-[#6ff5c8cc]">{member.role}</p>
            <p className="mt-3 text-xs leading-5 font-[400] text-[#e6efee80]">{member.note}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
