import type { Metadata } from 'next'
import { Mission, Team } from '../components/sections/About'
import { PageIntro } from '../components/ui/SectionHeading'

export const metadata: Metadata = { title: '關於我們' }

/** 關於我們（Body）：創立初衷 → 團隊成員名單 */
export default function AboutPage() {
  return (
    <>
      <PageIntro en="About us" title="關於我們" lead="我們是誰、為什麼想做一個 ASMR 網站。" />
      <Mission />
      <Team />
    </>
  )
}
