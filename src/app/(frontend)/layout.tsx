import type { Metadata, Viewport } from 'next'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Aurora } from './components/site/Aurora'
import { HeadphoneGate } from './components/site/HeadphoneGate'
import { PlayerProvider } from './components/site/Player'
import { RevealObserver } from './components/site/RevealObserver'
import './styles.css'

const title = 'Checkout. — 把世界調小聲一點'
const description =
  '一個收藏、理解與分享 ASMR 的聲音角落。戴上耳機，體驗 3D 聲音、調配你的放鬆配方，聆聽來自世界各地的 ASMR。'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: title, template: '%s — Checkout.' },
  description,
  applicationName: 'Checkout.',
  appleWebApp: { capable: true, title: 'Checkout.', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192' }],
    apple: '/apple-icon.png',
  },
  openGraph: { title, description, type: 'website', locale: 'zh_TW', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
}

export const viewport: Viewport = {
  themeColor: '#050812',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // 讓畫面延伸到 iPhone 瀏海／底部橫條區域
}

/**
 * ================================================================
 * 全站共用的外框：Header ＋ 中間頁面（Body）＋ Footer
 * 中間頁面在各自的 page.tsx：
 *   首頁       → (frontend)/page.tsx
 *   關於我們   → (frontend)/about/page.tsx
 *   ASMR 檔案  → (frontend)/archive/page.tsx
 *   感官體驗   → (frontend)/experience/page.tsx
 * ================================================================
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-night text-mist antialiased">
        <Aurora />
        <HeadphoneGate />
        <RevealObserver />
        <PlayerProvider>
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
        </PlayerProvider>
      </body>
    </html>
  )
}
