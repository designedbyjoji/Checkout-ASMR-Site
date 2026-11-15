import type { Metadata } from 'next'
import { HistoryPage } from '@/app/ui/body/archive-page'

export const metadata: Metadata = { title: '歷史發展' }

export default function Page() {
  return <HistoryPage />
}
