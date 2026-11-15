import type { Metadata, Viewport } from 'next'
import { Header } from '@/app/ui/header'
import { Footer } from '@/app/ui/footer'
import { Aurora, HeadphoneGate, RevealObserver } from '@/app/ui/site-effects'
import { PlayerProvider } from '@/app/ui/audio-player'
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
 * Header＝ui/header.tsx、Footer＝ui/footer.tsx，中間頁面（Body）在 src/app/ui/body/；page.tsx 是 Next.js 必需的路由入口。
 * (site) 是網站專用的內部分類，不會出現在網址中。
 * ================================================================
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        {/* Chiron Hei HK Text 字體：依常用程度切成小檔，只下載頁面用到的字 */}
        <link rel="stylesheet" href="/fonts/chiron/chiron.css" />
      </head>
      <body className="min-h-screen bg-[#050812] text-[#e6efee] antialiased">
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
