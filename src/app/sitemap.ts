import type { MetadataRoute } from 'next'
import { siteNav } from '@/app/ui/site-content'
import { siteUrl } from '@/lib/site-url'

/**
 * 網站地圖（/sitemap.xml）：告訴 Google 網站有哪些頁面。
 * 頁面清單直接取自 siteNav，新增子頁面時會自動出現在這裡。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', ...siteNav.flatMap((section) => section.children.map((child) => child.href))]

  return pages.map((path) => ({
    url: `${siteUrl}${path === '/' ? '' : path}`,
    changeFrequency: path === '/experience/library' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
