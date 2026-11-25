import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site-url'

/**
 * /robots.txt：告訴搜尋引擎哪些頁面可以收錄。
 * 後台（/admin）、資料介面（/api）和上傳入口不需要出現在搜尋結果。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/submit-track'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
