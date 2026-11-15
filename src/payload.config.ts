import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { AsmrTracks } from './collections/AsmrTracks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* ----------------------------------------------------------------
   環境變數（在 Vercel 後台 Settings → Environment Variables 設定；
   本機開發放在 .env.local）
   - PAYLOAD_SECRET        自己設定的一串隨機英數字（加密登入用）
   - DATABASE_URL          Neon 資料庫連線網址（Vercel 串接 Neon 後會自動產生）
   - BLOB_READ_WRITE_TOKEN Vercel Blob 金鑰（建立 Blob 空間後會自動產生）
   ---------------------------------------------------------------- */
const secret = process.env.PAYLOAD_SECRET
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

if (!secret) {
  throw new Error('缺少 PAYLOAD_SECRET：請在 Vercel 環境變數或 .env.local 設定。')
}
if (!databaseUrl) {
  throw new Error('缺少 DATABASE_URL：請在 Vercel 串接 Neon 資料庫，或在 .env.local 貼上連線網址。')
}

export default buildConfig({
  secret,
  db: postgresAdapter({
    pool: { connectionString: databaseUrl },
    // 資料表結構一律透過 src/migrations 裡的檔案建立（部署時自動執行），避免本機與線上不一致
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  collections: [Admins, Media, Folders, Tags, AsmrTracks],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  // 音檔與圖片存到 Vercel Blob（有金鑰時才啟用；沒有金鑰的本機環境會存在專案資料夾）
  storage: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      token: blobToken,
      collections: {
        'asmr-tracks': true,
        media: true,
      },
    }),
  ],
  plugins: [mcpPlugin({})],
})
