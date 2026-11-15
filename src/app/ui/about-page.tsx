import { Mission, Team } from '@/app/ui/about-sections'
import { PageIntro } from '@/app/ui/section-heading'

/** 關於我們：創立初衷 → 團隊成員名單 */
export default function AboutPage() {
  return (
    <>
      <PageIntro en="About us" title="關於我們" lead="我們是誰、為什麼想做一個 ASMR 網站。" />
      <Mission />
      <Team />
    </>
  )
}
