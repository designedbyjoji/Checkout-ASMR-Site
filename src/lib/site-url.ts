/**
 * 網站的正式網址（例如 https://checkout-asmr.vercel.app）。
 * 換網域時，只要到 Vercel 改環境變數 NEXT_PUBLIC_SITE_URL 再重新部署，
 * 分享預覽、sitemap.xml、robots.txt 都會跟著換，不用改程式。
 *
 * 沒設定時：在 Vercel 上自動用專案的正式網址，在自己電腦則用 localhost。
 */
function resolveSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/+$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

export const siteUrl = resolveSiteUrl()
