import Image from 'next/image'
import { Section, SectionHeading, Subpage } from '../shared'
import { mission, team } from '../site-content'

/**
 * 關於我們：每個子分頁都是獨立的一頁
 *   /about/mission 創立初衷、/about/team 團隊成員名單
 *   （網址 /about 會自動跳到第一個子分頁）
 */

// ─────────────── 關於我們的子分頁 ───────────────

/** /about/mission 創立初衷（純文字版；會動的捲動故事放在首頁） */
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

/**
 * 關於我們 ▸ 創立初衷
 *   左邊：大標題；右邊：三段文字，每段前面有編號和關鍵字
 *   下面：一張像查字典的「check·out」卡片
 * 文字都在 site-content.ts 的 mission。
 */
export function Mission() {
  const d = mission.definition
  return (
    <Section id="mission">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading weight={{ title: 900 }} title={mission.title} />
          <MissionWave />
        </div>

        <ol className="flex flex-col">
          {mission.paragraphs.map((p, i) => (
            <li
              key={i}
              className="reveal grid grid-cols-[auto_1fr] gap-x-5 border-t border-[#ffffff14] py-8 first:border-t-0 first:pt-0 sm:gap-x-8 lg:first:pt-16"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="flex flex-col items-center gap-2 pt-1">
                <span className="font-serif text-sm font-[400] text-[#e6efee66] italic">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="aurora-text text-lg leading-tight font-[900] [writing-mode:vertical-rl] sm:text-xl">
                  {mission.keywords[i]}
                </span>
              </span>
              <p className="text-base leading-8 font-[400] text-[#e6efeeb2] sm:text-lg sm:leading-9">{p}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* 字典條目：check·out 的兩個意思 */}
      <article className="glass reveal relative mt-20 overflow-hidden rounded-3xl p-7 sm:p-10 lg:mt-28 lg:p-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,#6ff5c826,transparent_70%)]"
        />
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-serif text-[clamp(2.5rem,8vw,4.5rem)] leading-none font-[400] italic">{d.word}</span>
          <span className="font-serif text-lg font-[400] text-[#e6efee80]">{d.phonetic}</span>
          <span className="font-serif text-lg font-[400] text-[#6ff5c8cc] italic">{d.partOfSpeech}</span>
        </p>
        <ol className="mt-8 grid gap-6 border-t border-[#ffffff1a] pt-8 sm:grid-cols-2 sm:gap-10">
          {d.senses.map((sense, i) => (
            <li key={sense.meaning} className="grid grid-cols-[auto_1fr] gap-x-4">
              <span className="font-serif text-xl font-[400] text-[#e6efee66]">{i + 1}.</span>
              <span>
                <span className="block text-2xl font-[900] tracking-[0.06em] sm:text-3xl">{sense.meaning}</span>
                <span className="mt-2 block text-sm leading-7 font-[400] text-[#e6efee99] sm:text-base">
                  {sense.example}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </article>
    </Section>
  )
}

/** 標題下面一條從亂到平穩的靜態聲波（呼應「把聲音放慢」） */
function MissionWave() {
  const N = 120
  let d = ''
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const calm = t // 左邊亂、右邊平穩
    const freq = 14 - 12 * calm
    const amp = 26 * Math.sin(Math.PI * Math.min(1, t * 1.15))
    const noise = (Math.sin(t * 90) * 0.5 + Math.sin(t * 47) * 0.35) * (1 - calm) * 14
    const y = 40 + Math.sin(t * freq * Math.PI * 2) * amp * (1 - calm * 0.5) + noise
    d += `${i === 0 ? 'M' : 'L'}${(t * 400).toFixed(1)} ${y.toFixed(1)}`
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 400 80" className="reveal mt-10 h-16 w-full max-w-md sm:h-20">
      <defs>
        <linearGradient id="mission-wave" x1="0" x2="1">
          <stop offset="0" stopColor="#ff9ad5" />
          <stop offset="0.5" stopColor="#4cc9ff" />
          <stop offset="1" stopColor="#6ff5c8" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#mission-wave)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
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
        weight={{ title: 900, lead: 700 }}
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
            {member.photo ? (
              <Image
                src={member.photo}
                alt=""
                aria-hidden="true"
                className="size-16 rounded-full object-cover sm:size-20"
              />
            ) : (
              <span
                aria-hidden="true"
                className={`grid size-16 place-items-center rounded-full bg-gradient-to-br text-xl font-[500] text-[#050812] sm:size-20 sm:text-2xl ${
                  gradients[i % gradients.length]
                }`}
              >
                {member.name.replace(/^成員\s*/, '').slice(0, 1)}
              </span>
            )}
            <p className="mt-5 text-base font-[900]">{member.name}</p>
            <p className="mt-1 text-xs font-[700] tracking-wide text-[#6ff5c8cc]">{member.role}</p>
            <p className="mt-3 text-xs leading-5 font-[400] text-[#e6efee80]">{member.note}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
