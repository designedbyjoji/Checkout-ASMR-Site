import type { Metadata } from 'next'
import { MissionPage } from '@/app/ui/body/about-page'

export const metadata: Metadata = { title: '創立初衷' }

export default function Page() {
  return <MissionPage />
}
