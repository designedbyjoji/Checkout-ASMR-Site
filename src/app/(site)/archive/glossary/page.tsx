import type { Metadata } from 'next'
import { GlossaryPage } from '@/app/ui/body/archive-page'

export const metadata: Metadata = { title: '核心用詞解密' }

export default function Page() {
  return <GlossaryPage />
}
