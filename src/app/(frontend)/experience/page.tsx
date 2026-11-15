import type { Metadata } from 'next'
import { getApprovedTracks } from '@/lib/tracks'
import { Library } from '../components/sections/Library'
import { MatchQuiz } from '../components/sections/MatchQuiz'
import { SoundLab } from '../components/sections/SoundLab'
import { PageIntro } from '../components/ui/SectionHeading'

export const metadata: Metadata = { title: '感官體驗' }

/** 感官體驗（Body）：最適合你的 ASMR → 聲音實驗室 → 聲音資料庫 */
export default async function ExperiencePage() {
  const tracks = await getApprovedTracks()
  return (
    <>
      <PageIntro
        en="Sensory experience"
        title="感官體驗"
        lead="請戴上耳機。先找出你的觸發類型，再親耳試試 3D 聲音與混音台，最後到聲音資料庫慢慢待著。"
      />
      <MatchQuiz />
      <SoundLab />
      <Library tracks={tracks} />
    </>
  )
}
