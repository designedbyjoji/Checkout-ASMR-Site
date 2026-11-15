import { Gateways } from '@/app/ui/home-gateways'
import { Hero } from '@/app/ui/home-hero'

/**
 * 首頁內容。想調整首頁段落順序，請改這個檔案。
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Gateways />
    </>
  )
}
