import { Glossary } from '@/app/ui/asmr-glossary'
import { Sociology } from '@/app/ui/sociology'
import { Timeline } from '@/app/ui/asmr-timeline'
import { PageIntro } from '@/app/ui/section-heading'

/** ASMR 檔案：核心用詞解密 → 歷史發展 → 社會學洞察 */
export default function ArchivePage() {
  return (
    <>
      <PageIntro
        en="ASMR archive"
        title="ASMR 檔案"
        lead="從幾個關鍵字開始，認識這種「由聲音引起的酥麻感」，以及它如何變成一種全球性的消費文化。"
      />
      <Glossary />
      <Timeline />
      <Sociology />
    </>
  )
}
