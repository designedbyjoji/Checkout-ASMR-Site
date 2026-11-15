import { mission, team } from './site-content'
import { Section, SectionHeading } from './section-heading'

/** 關於我們 ▸ 創立初衷 */
export function Mission() {
  return (
    <Section id="mission">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <SectionHeading index="01" kicker="Our mission" title={mission.title} />
        <div className="flex flex-col gap-6 lg:pt-16">
          {mission.paragraphs.map((p, i) => (
            <p
              key={i}
              className="reveal text-base leading-8 text-mist/70 sm:text-lg sm:leading-9"
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
    'from-aurora-mint to-aurora-cyan',
    'from-aurora-cyan to-aurora-violet',
    'from-aurora-violet to-aurora-rose',
    'from-aurora-rose to-aurora-mint',
  ]
  return (
    <Section id="team">
      <SectionHeading
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
              className={`grid size-16 place-items-center rounded-full bg-gradient-to-br text-xl font-medium text-night sm:size-20 sm:text-2xl ${
                gradients[i % gradients.length]
              }`}
            >
              {member.name.replace(/^成員\s*/, '').slice(0, 1)}
            </span>
            <p className="mt-5 text-base font-medium">{member.name}</p>
            <p className="mt-1 text-xs tracking-wide text-aurora-mint/80">{member.role}</p>
            <p className="mt-3 text-xs leading-5 text-mist/50">{member.note}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
