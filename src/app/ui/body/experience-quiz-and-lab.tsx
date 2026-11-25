'use client'

import Link from 'next/link'
import { useState, useCallback, useEffect, useRef } from 'react'
import { categoryLabels, quiz, quizResults, type Category } from '../site-content'
import { Icon, Section, SectionHeading } from '../shared'
import { claimAudio, getAudioContext, onAudioClaimed, startSound, type SoundHandle, type SoundKind } from '@/lib/synth'

/**
 * 體驗頁的互動區：ASMR 配對測驗 ＋ 聲音實驗室（3D 聲音、混音器）
 */

// ─────────────── 配對測驗 MatchQuiz ───────────────

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
          weight={{ title: 900, lead: 700 }}
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
                  i < step ? 'bg-[#6ff5c8]' : 'bg-[#ffffff1a]'
                }`}
              />
            ))}
          </div>

          {!done ? (
            <div key={step} className="animate-[fade-up_700ms_var(--ease-calm)]">
              <p className="mt-8 text-xs font-[400] tracking-[0.3em] text-[#e6efee73]">
                QUESTION {step + 1} / {quiz.length}
              </p>
              <h3 className="mt-3 text-2xl leading-snug font-[500] sm:text-3xl">{quiz[step].question}</h3>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {quiz[step].options.map((option, i) => (
                  <li key={option.label}>
                    <button
                      onClick={() => choose(i)}
                      className="w-full rounded-2xl border border-[#ffffff1f] bg-[#ffffff08] px-5 py-4 text-left text-sm leading-6 font-[400] transition-all duration-300 hover:border-[#6ff5c899] hover:bg-[#6ff5c81a] sm:text-base"
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="mt-6 text-xs font-[400] tracking-[0.2em] text-[#e6efee73] hover:text-[#e6efee]"
                >
                  ← 上一題
                </button>
              )}
            </div>
          ) : (
            result && (
              <div className="animate-[fade-up_700ms_var(--ease-calm)]">
                <p className="mt-8 text-xs font-[400] tracking-[0.3em] text-[#e6efee73]">你的觸發類型是</p>
                <h3 className="aurora-text mt-3 text-4xl font-[500] sm:text-5xl">{quizResults[result].title}</h3>
                <p className="mt-6 text-base leading-8 font-[400] text-[#e6efeeb2]">{quizResults[result].body}</p>
                <p className="mt-4 rounded-2xl bg-[#ffffff0a] px-5 py-4 text-sm leading-7 font-[400] text-[#e6efeea6]">
                  {quizResults[result].tryIt}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {/* 跳到其他子分頁，網址參數會告訴那一頁要套用哪個配方／篩選哪個類型 */}
                  <Link
                    className="btn-primary font-[600]"
                    href={`/experience/lab?mix=${encodeURIComponent(quizResults[result].mix)}`}
                  >
                    <Icon name="headphones" className="size-4" /> 用混音台試試
                  </Link>
                  <Link className="btn-ghost font-[500]" href={`/experience/library?category=${result}`}>
                    聽「{categoryLabels[result]}」
                  </Link>
                  <button onClick={restart} className="px-2 py-3 text-xs font-[400] tracking-[0.2em] text-[#e6efee73] hover:text-[#e6efee]">
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

// ─────────────── 聲音實驗室 SoundLab ───────────────

export function SoundLab() {
  return (
    <Section id="lab">
        <SectionHeading
          weight={{ title: 900, lead: 700 }}
          title={
            <>
              戴上耳機，
              <br />
              <span className="aurora-text">親耳試試看</span>
            </>
          }
          lead="這裡的聲音全部由瀏覽器即時合成，不需要下載。拖動光點，感受聲音繞著你的頭移動；或是調出屬於你的放鬆配方。"
        />
        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-[1.1fr_1fr]">
          <BinauralPad />
          <Mixer />
        </div>
    </Section>
  )
}

/* ================================================================
   3D 聲音定位
   ================================================================ */

const padSounds: { kind: SoundKind; label: string }[] = [
  { kind: 'tapping', label: '敲擊' },
  { kind: 'brushing', label: '刷刷' },
  { kind: 'shh', label: '噓聲' },
]

function directionLabel(x: number, y: number) {
  if (Math.hypot(x, y) < 0.2) return '就在你耳邊'
  const angle = (Math.atan2(x, -y) * 180) / Math.PI // 0 = 正前方
  if (angle > -30 && angle <= 30) return '前方'
  if (angle > 30 && angle <= 60) return '右前方'
  if (angle > 60 && angle <= 120) return '右耳'
  if (angle > 120 && angle <= 150) return '右後方'
  if (angle > 150 || angle <= -150) return '後腦勺'
  if (angle > -150 && angle <= -120) return '左後方'
  if (angle > -120 && angle <= -60) return '左耳'
  return '左前方'
}

function BinauralPad() {
  const [playing, setPlaying] = useState(false)
  const [kind, setKind] = useState<SoundKind>('tapping')
  const [orbit, setOrbit] = useState(true)
  const [pos, setPos] = useState({ x: 0.75, y: -0.3 })
  const pannerRef = useRef<PannerNode | null>(null)
  const outRef = useRef<GainNode | null>(null)
  const handleRef = useRef<SoundHandle | null>(null)
  const padRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const applyPosition = useCallback((x: number, y: number) => {
    const panner = pannerRef.current
    if (!panner) return
    const px = x * 2.2
    const pz = y * 2.2
    if (panner.positionX) {
      const t = panner.context.currentTime
      panner.positionX.setTargetAtTime(px, t, 0.03)
      panner.positionY.setTargetAtTime(0, t, 0.03)
      panner.positionZ.setTargetAtTime(pz, t, 0.03)
    } else {
      panner.setPosition(px, 0, pz)
    }
  }, [])

  const stop = useCallback(() => {
    handleRef.current?.stop()
    handleRef.current = null
    const out = outRef.current
    if (out) {
      out.gain.setTargetAtTime(0, out.context.currentTime, 0.05)
      window.setTimeout(() => out.disconnect(), 300)
    }
    outRef.current = null
    pannerRef.current = null
    setPlaying(false)
  }, [])

  useEffect(() => onAudioClaimed('lab-3d', stop), [stop])
  useEffect(() => stop, [stop])

  function start(nextKind = kind) {
    const ctx = getAudioContext()
    claimAudio('lab-3d')
    handleRef.current?.stop()
    if (!pannerRef.current) {
      const panner = ctx.createPanner()
      panner.panningModel = 'HRTF'
      panner.distanceModel = 'inverse'
      panner.refDistance = 0.6
      panner.rolloffFactor = 0.8
      const out = ctx.createGain()
      out.gain.value = 0.9
      panner.connect(out).connect(ctx.destination)
      pannerRef.current = panner
      outRef.current = out
    }
    applyPosition(pos.x, pos.y)
    handleRef.current = startSound(nextKind, ctx, pannerRef.current)
    setPlaying(true)
  }

  function chooseKind(next: SoundKind) {
    setKind(next)
    if (playing) start(next)
  }

  // 自動環繞
  useEffect(() => {
    if (!orbit || !playing) return
    let frame = 0
    let last = performance.now()
    let angle = Math.atan2(pos.x, -pos.y)
    const loop = (now: number) => {
      angle += ((now - last) / 1000) * 0.7
      last = now
      const next = { x: Math.sin(angle) * 0.75, y: -Math.cos(angle) * 0.75 }
      setPos(next)
      applyPosition(next.x, next.y)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orbit, playing, applyPosition])

  function pointerToPos(event: React.PointerEvent) {
    const rect = padRef.current!.getBoundingClientRect()
    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    let y = ((event.clientY - rect.top) / rect.height) * 2 - 1
    const len = Math.hypot(x, y)
    if (len > 0.92) {
      x = (x / len) * 0.92
      y = (y / len) * 0.92
    }
    setPos({ x, y })
    applyPosition(x, y)
  }

  return (
    <div className="glass reveal flex min-w-0 flex-col rounded-[2rem] p-5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="kicker font-[600]">Binaural · 3D</p>
          <h3 className="mt-2 text-2xl font-[500]">聲音繞著你轉</h3>
        </div>
        <button
          onClick={() => (playing ? stop() : start())}
          className={`grid size-14 shrink-0 place-items-center rounded-full transition-all duration-500 ${
            playing ? 'bg-[#e6efee] text-[#050812]' : 'bg-gradient-to-br from-[#6ff5c8] to-[#4cc9ff] text-[#050812] shadow-[0_0_40px_#6ff5c873]'
          }`}
          aria-label={playing ? '停止' : '播放'}
        >
          <Icon name={playing ? 'pause' : 'play'} className="size-5" />
        </button>
      </div>

      {/* 俯視圖：上方 = 你的前方 */}
      <div
        ref={padRef}
        className="relative mx-auto my-8 aspect-square w-full max-w-[420px] touch-none select-none"
        onPointerDown={(e) => {
          draggingRef.current = true
          e.currentTarget.setPointerCapture?.(e.pointerId)
          setOrbit(false)
          if (!playing) start()
          pointerToPos(e)
        }}
        onPointerMove={(e) => draggingRef.current && pointerToPos(e)}
        onPointerUp={() => (draggingRef.current = false)}
        onPointerCancel={() => (draggingRef.current = false)}
        role="application"
        aria-label="3D 聲音位置。拖動光點來移動聲音。"
      >
        {[1, 0.66, 0.33].map((s) => (
          <span
            key={s}
            className="absolute rounded-full border border-dashed border-[#ffffff1a]"
            style={{ inset: `${((1 - s) / 2) * 100}%` }}
          />
        ))}
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-[400] tracking-[0.3em] text-[#e6efee59]">前</span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-[400] tracking-[0.3em] text-[#e6efee59]">後</span>
        <span className="absolute top-1/2 left-1 -translate-y-1/2 text-[10px] font-[400] text-[#e6efee59]">左</span>
        <span className="absolute top-1/2 right-1 -translate-y-1/2 text-[10px] font-[400] text-[#e6efee59]">右</span>

        {/* 頭（俯視） */}
        <svg viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 w-[22%] -translate-x-1/2 -translate-y-1/2 text-[#e6efeeb2]" aria-hidden="true">
          <ellipse cx="50" cy="52" rx="30" ry="34" fill="#ffffff0f" stroke="currentColor" strokeWidth="2" />
          <path d="M44 19 50 10l6 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <rect x="12" y="40" width="9" height="22" rx="4.5" fill="currentColor" />
          <rect x="79" y="40" width="9" height="22" rx="4.5" fill="currentColor" />
        </svg>

        {/* 聲源光點 */}
        <span
          className="absolute size-11 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: `${(pos.x + 1) * 50}%`, top: `${(pos.y + 1) * 50}%` }}
        >
          <span className="absolute inset-0 rounded-full bg-[#6ff5c84c] blur-md" />
          {playing && <span className="animate-ping-soft absolute inset-0 rounded-full border border-[#6ff5c8b2]" />}
          <span className="absolute inset-[30%] rounded-full bg-[#ffffff] shadow-[0_0_20px_#6ff5c8]" />
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <p className="text-center text-sm font-[400] text-[#e6efee99]" aria-live="polite">
          {playing ? (
            <>
              聲音現在在你的 <span className="text-[#6ff5c8]">{directionLabel(pos.x, pos.y)}</span>
            </>
          ) : (
            '按下播放，或直接拖動光點'
          )}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {padSounds.map((s) => (
            <button key={s.kind} className="chip font-[400]" aria-pressed={kind === s.kind} onClick={() => chooseKind(s.kind)}>
              {s.label}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-[#ffffff1a]" />
          <button className="chip inline-flex items-center gap-1.5 font-[400]" aria-pressed={orbit} onClick={() => setOrbit((v) => !v)}>
            <Icon name="orbit" className="size-3.5" /> 自動環繞
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   觸發音混音台
   ================================================================ */

const layers: { kind: SoundKind; label: string; hint: string }[] = [
  { kind: 'rain', label: '雨聲', hint: 'Rain' },
  { kind: 'waves', label: '海浪', hint: 'Waves' },
  { kind: 'fire', label: '營火', hint: 'Fire' },
  { kind: 'tapping', label: '敲擊', hint: 'Tapping' },
  { kind: 'brushing', label: '刷刷', hint: 'Brushing' },
]

type Mix = Record<string, number>

const presets: { name: string; mix: Mix }[] = [
  { name: '雨夜讀書', mix: { rain: 70, waves: 0, fire: 25, tapping: 0, brushing: 0 } },
  { name: '海邊午睡', mix: { rain: 0, waves: 75, fire: 0, tapping: 0, brushing: 15 } },
  { name: '壁爐旁', mix: { rain: 20, waves: 0, fire: 70, tapping: 0, brushing: 0 } },
  { name: '專注模式', mix: { rain: 35, waves: 0, fire: 0, tapping: 45, brushing: 0 } },
]

const toGain = (v: number) => (v / 100) ** 2 * 0.9

function Mixer() {
  const [playing, setPlaying] = useState(false)
  const [mix, setMix] = useState<Mix>(presets[0].mix)
  const masterRef = useRef<GainNode | null>(null)
  const voicesRef = useRef(new Map<string, { gain: GainNode; handle: SoundHandle }>())

  const syncVoices = useCallback((nextMix: Mix) => {
    const master = masterRef.current
    if (!master) return
    const ctx = master.context as AudioContext
    for (const layer of layers) {
      const volume = nextMix[layer.kind] ?? 0
      const voice = voicesRef.current.get(layer.kind)
      if (volume > 0 && !voice) {
        const gain = ctx.createGain()
        gain.gain.value = 0
        gain.connect(master)
        gain.gain.setTargetAtTime(toGain(volume), ctx.currentTime, 0.3)
        voicesRef.current.set(layer.kind, { gain, handle: startSound(layer.kind, ctx, gain) })
      } else if (voice && volume > 0) {
        voice.gain.gain.setTargetAtTime(toGain(volume), ctx.currentTime, 0.1)
      } else if (voice && volume === 0) {
        voice.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
        const old = voice
        window.setTimeout(() => {
          old.handle.stop()
          old.gain.disconnect()
        }, 600)
        voicesRef.current.delete(layer.kind)
      }
    }
  }, [])

  const stop = useCallback(() => {
    const master = masterRef.current
    if (master) {
      master.gain.setTargetAtTime(0, master.context.currentTime, 0.2)
      const voices = [...voicesRef.current.values()]
      window.setTimeout(() => {
        voices.forEach((v) => v.handle.stop())
        master.disconnect()
      }, 800)
    }
    voicesRef.current.clear()
    masterRef.current = null
    setPlaying(false)
  }, [])

  useEffect(() => onAudioClaimed('lab-mix', stop), [stop])

  // 從測驗結果「用混音台試試」過來時（網址有 ?mix=配方名稱），自動套用對應配方
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get('mix')
    const preset = presets.find((p) => p.name === name)
    if (!preset) return
    const timer = window.setTimeout(() => {
      applyPresetRef.current(preset.mix)
      document.getElementById('mixer')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 600)
    return () => window.clearTimeout(timer)
  }, [])
  useEffect(() => stop, [stop])

  function start(nextMix = mix) {
    const ctx = getAudioContext()
    claimAudio('lab-mix')
    if (!masterRef.current) {
      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)
      master.gain.setTargetAtTime(0.8, ctx.currentTime, 0.4)
      masterRef.current = master
    }
    syncVoices(nextMix)
    setPlaying(true)
  }

  function setLayer(kind: string, value: number) {
    const next = { ...mix, [kind]: value }
    setMix(next)
    if (playing) syncVoices(next)
  }

  function applyPreset(preset: Mix) {
    setMix(preset)
    start(preset)
  }
  const applyPresetRef = useRef(applyPreset)
  applyPresetRef.current = applyPreset

  return (
    <div id="mixer" className="glass reveal flex min-w-0 flex-col rounded-[2rem] p-5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="kicker font-[600]">Trigger mixer</p>
          <h3 className="mt-2 text-2xl font-[500]">調一杯放鬆配方</h3>
        </div>
        <button
          onClick={() => (playing ? stop() : start())}
          className={`grid size-14 shrink-0 place-items-center rounded-full transition-all duration-500 ${
            playing ? 'bg-[#e6efee] text-[#050812]' : 'bg-gradient-to-br from-[#a084ff] to-[#4cc9ff] text-[#050812] shadow-[0_0_40px_#a084ff73]'
          }`}
          aria-label={playing ? '停止混音' : '播放混音'}
        >
          <Icon name={playing ? 'pause' : 'play'} className="size-5" />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.name}
            className="chip font-[400]"
            aria-pressed={playing && JSON.stringify(p.mix) === JSON.stringify(mix)}
            onClick={() => applyPreset(p.mix)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <ul className="mt-8 flex flex-col gap-5">
        {layers.map((layer) => {
          const value = mix[layer.kind] ?? 0
          return (
            <li key={layer.kind} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[6rem_1fr_2.5rem]">
              <label htmlFor={`mix-${layer.kind}`} className="flex flex-col">
                <span className="text-sm font-[400]">{layer.label}</span>
                <span className="font-serif text-xs font-[400] text-[#e6efee66] italic">{layer.hint}</span>
              </label>
              <input
                id={`mix-${layer.kind}`}
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => setLayer(layer.kind, Number(e.target.value))}
                className="slider"
                style={{ '--fill': `${value}%` } as React.CSSProperties}
              />
              <span className="text-right text-xs font-[400] text-[#e6efee73] tabular-nums">{value}</span>
            </li>
          )
        })}
      </ul>

      <p className="mt-8 flex items-center gap-2 text-xs leading-6 font-[400] text-[#e6efee66]">
        <Icon name="volume" className="size-4 shrink-0" />
        建議音量先調小，再慢慢加大。
      </p>
    </div>
  )
}
