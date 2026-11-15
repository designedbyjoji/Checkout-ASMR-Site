import { Gateways } from './components/sections/Gateways'
import { Hero } from './components/sections/Hero'

/**
 * 首頁（Body）
 * 想加段落：在 components/sections 新增元件，再放進下面。
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Gateways />
    </>
  )
}
