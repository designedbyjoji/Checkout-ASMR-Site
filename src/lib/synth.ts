'use client'

/**
 * 用 Web Audio API 即時「合成」ASMR 觸發音。
 * 好處：不需要任何音檔，網站一上線就能互動；之後有真實錄音再替換也可以。
 */

let sharedContext: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (!sharedContext) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    sharedContext = new Ctor()
  }
  if (sharedContext.state === 'suspended') void sharedContext.resume()
  return sharedContext
}

/* ---------- 雜訊素材 ---------- */

const noiseCache = new Map<string, AudioBuffer>()

function noiseBuffer(ctx: AudioContext, color: 'white' | 'pink' | 'brown', seconds = 4) {
  const key = `${color}-${seconds}-${ctx.sampleRate}`
  const cached = noiseCache.get(key)
  if (cached) return cached

  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    let last = 0
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1
      if (color === 'white') {
        data[i] = white * 0.5
      } else if (color === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.969 * b2 + white * 0.153852
        b3 = 0.8665 * b3 + white * 0.3104856
        b4 = 0.55 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.016898
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      } else {
        last = (last + 0.02 * white) / 1.02
        data[i] = last * 3.5
      }
    }
  }
  noiseCache.set(key, buffer)
  return buffer
}

function loopNoise(ctx: AudioContext, color: 'white' | 'pink' | 'brown') {
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer(ctx, color)
  source.loop = true
  return source
}

/** 一次性的短促雜訊（敲擊、雨滴、劈啪聲） */
function burst(
  ctx: AudioContext,
  out: AudioNode,
  at: number,
  opts: { freq: number; q: number; gain: number; decay: number; type?: BiquadFilterType },
) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 'white', 1)
  const filter = ctx.createBiquadFilter()
  filter.type = opts.type ?? 'bandpass'
  filter.frequency.value = opts.freq
  filter.Q.value = opts.q
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, at)
  env.gain.exponentialRampToValueAtTime(opts.gain, at + 0.003)
  env.gain.exponentialRampToValueAtTime(0.0001, at + opts.decay)
  src.connect(filter).connect(env).connect(out)
  src.start(at, Math.random() * 0.5)
  src.stop(at + opts.decay + 0.05)
}

/** 用 setInterval 提前排程事件，避免計時器抖動 */
function scheduler(ctx: AudioContext, next: (time: number) => number) {
  let nextTime = ctx.currentTime + 0.05
  const tick = () => {
    while (nextTime < ctx.currentTime + 0.3) {
      nextTime += next(nextTime)
    }
  }
  tick()
  const id = window.setInterval(tick, 90)
  return () => window.clearInterval(id)
}

/* ---------- 各種聲音 ---------- */

export type SoundKind = 'rain' | 'waves' | 'fire' | 'tapping' | 'brushing' | 'shh'

export type SoundHandle = { stop: () => void }

const rand = (min: number, max: number) => min + Math.random() * (max - min)

export function startSound(kind: SoundKind, ctx: AudioContext, out: AudioNode): SoundHandle {
  const nodes: AudioScheduledSourceNode[] = []
  const cleanups: Array<() => void> = []

  switch (kind) {
    case 'rain': {
      const bed = loopNoise(ctx, 'pink')
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 500
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 7000
      const g = ctx.createGain()
      g.gain.value = 0.55
      bed.connect(hp).connect(lp).connect(g).connect(out)
      bed.start()
      nodes.push(bed)
      cleanups.push(
        scheduler(ctx, (t) => {
          burst(ctx, out, t, { freq: rand(2500, 6000), q: 3, gain: rand(0.05, 0.18), decay: 0.04 })
          return rand(0.02, 0.12)
        }),
      )
      break
    }
    case 'waves': {
      const bed = loopNoise(ctx, 'brown')
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 1100
      const g = ctx.createGain()
      g.gain.value = 0.1
      bed.connect(lp).connect(g).connect(out)
      bed.start()
      nodes.push(bed)
      cleanups.push(
        scheduler(ctx, (t) => {
          const period = rand(6, 9)
          g.gain.setTargetAtTime(0.75, t, period * 0.18)
          g.gain.setTargetAtTime(0.08, t + period * 0.45, period * 0.2)
          lp.frequency.setTargetAtTime(1600, t, period * 0.2)
          lp.frequency.setTargetAtTime(700, t + period * 0.45, period * 0.2)
          return period
        }),
      )
      break
    }
    case 'fire': {
      const bed = loopNoise(ctx, 'brown')
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 480
      const g = ctx.createGain()
      g.gain.value = 0.55
      bed.connect(lp).connect(g).connect(out)
      bed.start()
      nodes.push(bed)
      cleanups.push(
        scheduler(ctx, (t) => {
          const crackle = Math.random() < 0.25 ? 3 : 1
          for (let i = 0; i < crackle; i++) {
            burst(ctx, out, t + i * rand(0.01, 0.03), {
              freq: rand(1800, 5000),
              q: 1.2,
              gain: rand(0.08, 0.35),
              decay: rand(0.008, 0.03),
              type: 'highpass',
            })
          }
          return rand(0.05, 0.45)
        }),
      )
      break
    }
    case 'tapping': {
      let step = 0
      cleanups.push(
        scheduler(ctx, (t) => {
          // 木頭桌面的「叩叩」聲：一個短促雜訊 + 低頻共鳴
          const accent = step % 4 === 0
          burst(ctx, out, t, {
            freq: rand(1700, 2600),
            q: 6,
            gain: accent ? 0.9 : 0.55,
            decay: 0.06,
          })
          const osc = ctx.createOscillator()
          osc.frequency.value = rand(420, 620)
          const og = ctx.createGain()
          og.gain.setValueAtTime(0.0001, t)
          og.gain.exponentialRampToValueAtTime(accent ? 0.35 : 0.2, t + 0.004)
          og.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
          osc.connect(og).connect(out)
          osc.start(t)
          osc.stop(t + 0.1)
          step++
          return step % 8 === 0 ? 0.55 : rand(0.13, 0.2)
        }),
      )
      break
    }
    case 'brushing': {
      const bed = loopNoise(ctx, 'white')
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 4200
      bp.Q.value = 0.7
      const g = ctx.createGain()
      g.gain.value = 0.0001
      bed.connect(bp).connect(g).connect(out)
      bed.start()
      nodes.push(bed)
      cleanups.push(
        scheduler(ctx, (t) => {
          const len = rand(0.55, 0.9)
          g.gain.setTargetAtTime(0.5, t, 0.05)
          g.gain.setTargetAtTime(0.0001, t + len * 0.55, 0.08)
          bp.frequency.setValueAtTime(rand(3000, 3800), t)
          bp.frequency.linearRampToValueAtTime(rand(4800, 6500), t + len * 0.6)
          return len + rand(0.05, 0.25)
        }),
      )
      break
    }
    case 'shh': {
      const bed = loopNoise(ctx, 'white')
      const f1 = ctx.createBiquadFilter()
      f1.type = 'bandpass'
      f1.frequency.value = 2600
      f1.Q.value = 1.4
      const f2 = ctx.createBiquadFilter()
      f2.type = 'highshelf'
      f2.frequency.value = 5000
      f2.gain.value = 6
      const g = ctx.createGain()
      g.gain.value = 0.0001
      bed.connect(f1).connect(f2).connect(g).connect(out)
      bed.start()
      nodes.push(bed)
      cleanups.push(
        scheduler(ctx, (t) => {
          // 像輕聲「噓——」一樣，慢慢起、慢慢收
          const len = rand(1.2, 2.2)
          g.gain.setTargetAtTime(0.7, t, len * 0.15)
          g.gain.setTargetAtTime(0.0001, t + len * 0.6, len * 0.12)
          f1.frequency.setValueAtTime(rand(2200, 2800), t)
          f1.frequency.linearRampToValueAtTime(rand(3000, 3600), t + len)
          return len + rand(0.6, 1.2)
        }),
      )
      break
    }
  }

  return {
    stop() {
      cleanups.forEach((fn) => fn())
      nodes.forEach((n) => {
        try {
          n.stop()
        } catch {
          /* already stopped */
        }
      })
    },
  }
}

/** 左右聲道提示音（耳機測試用） */
export function chime(side: 'left' | 'right') {
  const ctx = getAudioContext()
  const pan = ctx.createStereoPanner()
  pan.pan.value = side === 'left' ? -1 : 1
  pan.connect(ctx.destination)
  const t = ctx.currentTime + 0.02
  ;[0, 0.09].forEach((offset, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = side === 'left' ? [660, 880][i] : [880, 1320][i]
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t + offset)
    g.gain.exponentialRampToValueAtTime(0.18, t + offset + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + offset + 1.2)
    osc.connect(g).connect(pan)
    osc.start(t + offset)
    osc.stop(t + offset + 1.3)
  })
}

/* ---------- 同一時間只播一種聲音 ---------- */

const EXCLUSIVE_EVENT = 'checkout:exclusive'

export function claimAudio(owner: string) {
  window.dispatchEvent(new CustomEvent(EXCLUSIVE_EVENT, { detail: owner }))
}

export function onAudioClaimed(owner: string, release: () => void) {
  const handler = (event: Event) => {
    if ((event as CustomEvent<string>).detail !== owner) release()
  }
  window.addEventListener(EXCLUSIVE_EVENT, handler)
  return () => window.removeEventListener(EXCLUSIVE_EVENT, handler)
}
