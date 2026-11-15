import { timeline } from '../../content'
import { Section, SectionHeading } from '../ui/SectionHeading'

/** ASMR 檔案 ▸ 歷史發展 */
export function Timeline() {
  return (
    <Section id="history">
      <SectionHeading
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
          className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-aurora-mint/60 via-aurora-violet/40 to-transparent md:left-1/2"
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
                className={`absolute top-3 left-0 size-[15px] rounded-full border-2 border-night bg-aurora-mint shadow-[0_0_20px_rgb(111_245_200/0.8)] md:top-4 ${
                  right ? 'md:-left-[7.5px]' : 'md:right-[-7.5px] md:left-auto'
                }`}
              />
              <p className="font-serif text-5xl text-mist/90 italic sm:text-6xl">{item.year}</p>
              <h3 className="mt-3 text-xl font-medium tracking-wide">{item.title}</h3>
              <p
                className={`mt-3 max-w-md text-sm leading-7 text-mist/60 sm:text-base sm:leading-8 ${right ? '' : 'md:ml-auto'}`}
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
