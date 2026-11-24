import type { Metadata } from 'next'
import { TypesPage } from '@/app/ui/body/archive-page'

export const metadata: Metadata = { title: 'ASMR 類型' }

export default function Page() {
  return <TypesPage />
}
