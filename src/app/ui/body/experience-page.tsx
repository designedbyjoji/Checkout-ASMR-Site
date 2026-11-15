import { getApprovedTracks } from '@/lib/tracks'
import { Library } from './experience-sound-library'
import { MatchQuiz, SoundLab } from './experience-quiz-and-lab'
import { Subpage } from '../shared'

/**
 * 感官體驗：每個子分頁都是獨立的一頁
 *   /experience/match 最適合你的 ASMR、/experience/lab 聲音實驗室、/experience/library 聲音資料庫
 *   （網址 /experience 會自動跳到第一個子分頁）
 */

/** /experience/match 最適合你的 ASMR */
export function MatchPage() {
  return (
    <Subpage href="/experience/match">
      <MatchQuiz />
    </Subpage>
  )
}

/** /experience/lab 聲音實驗室 */
export function LabPage() {
  return (
    <Subpage href="/experience/lab">
      <SoundLab />
    </Subpage>
  )
}

/** /experience/library 聲音資料庫（從資料庫讀取已審核的聲音） */
export async function LibraryPage() {
  const tracks = await getApprovedTracks()
  return (
    <Subpage href="/experience/library">
      <Library tracks={tracks} />
    </Subpage>
  )
}
