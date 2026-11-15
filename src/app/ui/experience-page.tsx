import { getApprovedTracks } from '@/lib/tracks'
import { Library } from '@/app/ui/sound-library'
import { MatchQuiz, SoundLab } from '@/app/ui/quiz-and-lab'
import { PageIntro } from '@/app/ui/shared'

/** 感官體驗：最適合你的 ASMR → 聲音實驗室 → 聲音資料庫 */
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
