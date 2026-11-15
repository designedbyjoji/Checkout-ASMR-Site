'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** 讓有 .reveal 的元素捲進畫面時淡入；每次換頁都重新掃描一次 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    const scan = () =>
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el))
    scan()
    // 有些內容是之後才出現的（例如測驗結果），也一起照顧到
    const mutations = new MutationObserver(scan)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [pathname])

  return null
}
