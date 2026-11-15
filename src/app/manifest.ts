import type { MetadataRoute } from 'next'

/** 讓網站可以「加入主畫面」，像 App 一樣全螢幕開啟 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Checkout. — ASMR 聲音角落',
    short_name: 'Checkout.',
    description: '收藏、理解與分享 ASMR 的聲音角落',
    start_url: '/',
    display: 'standalone',
    background_color: '#050812',
    theme_color: '#050812',
    lang: 'zh-Hant',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
