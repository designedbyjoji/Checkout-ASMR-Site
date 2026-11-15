import type { Metadata } from 'next'
import { SociologyPage } from '@/app/ui/body/archive-page'

export const metadata: Metadata = { title: '社會學洞察' }

export default function Page() {
  return <SociologyPage />
}
