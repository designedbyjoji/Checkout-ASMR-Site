'use client'

import { useState } from 'react'
import { requestFilter, requestMix, scrollToId } from '@/lib/events'
import { categoryLabels, quiz, quizResults, type Category } from './site-content'
import { Icon } from './icon'
import { Section, SectionHeading } from './section-heading'

/** 感官體驗 ▸ 最適合你的 ASMR（三題小測驗） */
export function MatchQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const done = step >= quiz.length
  const result = done ? pickResult(answers) : null

  function choose(optionIndex: number) {
    const next = [...answers.slice(0, step), optionIndex]
    setAnswers(next)
    setStep(step + 1)
  }

  function restart() {
    setAnswers([])
    setStep(0)
  }

  return (
    <Section id="match">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <SectionHeading
          index="01"
          kicker="Find your trigger"
          title={
            <>
              最適合你的
              <br />
              <span className="aurora-text">ASMR</span>
            </>
          }
          lead="每個人的觸發點都不一樣。回答三個小問題，找出最可能讓你頭皮發麻的聲音。"
        />

        <div className="glass reveal min-w-0 rounded-[2rem] p-6 sm:p-9">
          {/* 進度 */}
          <div className="flex items-center gap-2" aria-hidden="true">
            {quiz.map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-700 ${
                  i < step ? 'bg-aurora-mint' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {!done ? (
            <div key={step} className="animate-[fade-up_700ms_var(--ease-calm)]">
              <p className="mt-8 text-xs tracking-[0.3em] text-mist/45">
                QUESTION {step + 1} / {quiz.length}
              </p>
              <h3 className="mt-3 text-2xl leading-snug font-light sm:text-3xl">{quiz[step].question}</h3>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {quiz[step].options.map((option, i) => (
                  <li key={option.label}>
                    <button
                      onClick={() => choose(i)}
                      className="w-full rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-4 text-left text-sm leading-6 transition-all duration-300 hover:border-aurora-mint/60 hover:bg-aurora-mint/10 sm:text-base"
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="mt-6 text-xs tracking-[0.2em] text-mist/45 hover:text-mist"
                >
                  ← 上一題
                </button>
              )}
            </div>
          ) : (
            result && (
              <div className="animate-[fade-up_700ms_var(--ease-calm)]">
                <p className="mt-8 text-xs tracking-[0.3em] text-mist/45">你的觸發類型是</p>
                <h3 className="aurora-text mt-3 text-4xl font-light sm:text-5xl">{quizResults[result].title}</h3>
                <p className="mt-6 text-base leading-8 text-mist/70">{quizResults[result].body}</p>
                <p className="mt-4 rounded-2xl bg-white/[0.04] px-5 py-4 text-sm leading-7 text-mist/65">
                  {quizResults[result].tryIt}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      scrollToId('lab')
                      window.setTimeout(() => requestMix(quizResults[result].mix), 600)
                    }}
                  >
                    <Icon name="headphones" className="size-4" /> 用混音台試試
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      requestFilter(result)
                      scrollToId('library')
                    }}
                  >
                    聽「{categoryLabels[result]}」
                  </button>
                  <button onClick={restart} className="px-2 py-3 text-xs tracking-[0.2em] text-mist/45 hover:text-mist">
                    重新測驗
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Section>
  )
}

function pickResult(answers: number[]): Category {
  const scores: Record<Category, number> = { whisper: 0, tapping: 0, texture: 0, nature: 0, roleplay: 0 }
  answers.forEach((optionIndex, q) => {
    const option = quiz[q]?.options[optionIndex]
    if (!option) return
    for (const [cat, value] of Object.entries(option.scores)) scores[cat as Category] += value ?? 0
  })
  return (Object.keys(scores) as Category[]).reduce((best, cat) => (scores[cat] > scores[best] ? cat : best))
}
