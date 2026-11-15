import type { Metadata } from 'next'
import { LabPage } from '@/app/ui/body/experience-page'

export const metadata: Metadata = { title: '聲音實驗室' }

export default function Page() {
  return <LabPage />
}
