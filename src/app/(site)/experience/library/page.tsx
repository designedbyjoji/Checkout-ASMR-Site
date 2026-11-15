import type { Metadata } from 'next'
import { LibraryPage } from '@/app/ui/body/experience-page'

export const metadata: Metadata = { title: '聲音資料庫' }

export default function Page() {
  return <LibraryPage />
}
