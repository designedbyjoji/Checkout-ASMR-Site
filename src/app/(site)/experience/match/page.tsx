import type { Metadata } from 'next'
import { MatchPage } from '@/app/ui/body/experience-page'

export const metadata: Metadata = { title: '最適合你的 ASMR' }

export default function Page() {
  return <MatchPage />
}
