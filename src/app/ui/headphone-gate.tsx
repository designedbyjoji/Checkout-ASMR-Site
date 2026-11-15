'use client'

import { useEffect, useState } from 'react'
import { chime, getAudioContext } from '@/lib/synth'
import { CheckoutLogo } from './checkout-logo'
import { Icon } from './icon'

type Step = 'intro' | 'left' | 'right' | 'done'

const STORAGE_KEY = 'checkout:gate-passed'

/**
 * 「請戴上耳機」入口。
 * 點一下按鈕，左耳、右耳依序響起提示音，確認耳機戴對。
 * 這一下點擊同時也「解鎖」了手機瀏覽器的聲音（瀏覽器規定要使用者先點過才能出聲）。
 */
export function HeadphoneGate() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [step, setStep] = useState<Step>('intro')

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== '1') setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  function close() {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* 無痕模式可能不能存 */
    }
    setLeaving(true)
    window.setTimeout(() => setVisible(false), 900)
  }

  function startTest() {
    getAudioContext()
    setStep('left')
    chime('left')
    window.setTimeout(() => {
      setStep('right')
      chime('right')
    }, 1300)
    window.setTimeout(() => setStep('done'), 2600)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-night/95 px-6 text-center backdrop-blur-2xl transition-opacity duration-[900ms] ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <CheckoutLogo className="absolute top-[max(1.5rem,env(safe-area-inset-top))] text-mist/90" />

      {/* 左右耳示意 */}
      <div className="relative mb-10 flex items-center gap-10 sm:gap-16" aria-hidden="true">
        <EarDot active={step === 'left'} label="L" />
        <div className="relative grid size-24 place-items-center rounded-full border border-white/15 sm:size-28">
          <Icon name="headphones" className="size-10 text-mist/80 sm:size-12" />
          {step === 'intro' && (
            <span className="animate-ping-soft absolute inset-0 rounded-full border border-aurora-mint/40" />
          )}
        </div>
        <EarDot active={step === 'right'} label="R" />
      </div>

      <p className="kicker">Please put on your headphones</p>
      <h1
        id="gate-title"
        className="mt-5 text-[clamp(2.2rem,8vw,4rem)] font-light leading-tight tracking-[0.18em]"
      >
        請戴上耳機
      </h1>
      <p className="mt-5 max-w-sm text-balance text-sm leading-7 text-mist/60" aria-live="polite">
        {step === 'intro' && 'ASMR 的細節藏在左右耳之間。找個安靜的角落，把音量調到舒服的大小。'}
        {step === 'left' && '你應該從「左耳」聽見一聲叮——'}
        {step === 'right' && '接著是「右耳」——'}
        {step === 'done' && '左右都聽到了嗎？準備好了就進來吧。'}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        {step === 'done' ? (
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={close} className="btn-primary">
              進入 Checkout. <Icon name="arrow" className="size-4" />
            </button>
            <button onClick={startTest} className="btn-ghost">
              再測一次
            </button>
          </div>
        ) : (
          <button onClick={startTest} disabled={step !== 'intro'} className="btn-primary disabled:opacity-60">
            {step === 'intro' ? '我戴好了，測試左右聲道' : '播放中⋯'}
          </button>
        )}
        <button onClick={close} className="text-xs tracking-[0.2em] text-mist/40 underline-offset-4 hover:text-mist/70 hover:underline">
          略過，直接進入
        </button>
      </div>
    </div>
  )
}

function EarDot({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`relative grid size-12 place-items-center rounded-full border text-xs font-semibold transition-all duration-700 ${
        active
          ? 'scale-110 border-aurora-mint bg-aurora-mint/15 text-aurora-mint shadow-[0_0_40px_rgb(111_245_200/0.6)]'
          : 'border-white/15 text-mist/40'
      }`}
    >
      {label}
      {active && <span className="animate-ping-soft absolute inset-0 rounded-full border border-aurora-mint/60" />}
    </span>
  )
}
