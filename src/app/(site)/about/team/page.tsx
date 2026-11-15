import type { Metadata } from 'next'
import { TeamPage } from '@/app/ui/body/about-page'

export const metadata: Metadata = { title: '團隊成員名單' }

export default function Page() {
  return <TeamPage />
}
