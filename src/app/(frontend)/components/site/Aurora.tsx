'use client'

import { useEffect, useRef } from 'react'

/** 固定在畫面最底層的極光背景；往下捲動時慢慢變暗，讓內容更好讀。 */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const progress = Math.min(window.scrollY / (window.innerHeight * 1.2), 1)
      el.style.setProperty('--veil', String(progress * 0.35))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="aurora" aria-hidden="true">
      <div className="aurora__stars" />
      <div className="aurora__ribbon aurora__ribbon--1" />
      <div className="aurora__ribbon aurora__ribbon--2" />
      <div className="aurora__ribbon aurora__ribbon--3" />
      <div className="aurora__bands" />
      <div className="aurora__veil" />
      <div className="aurora__grain" />
    </div>
  )
}
