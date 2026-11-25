import config from '@payload-config'
import { Buffer } from 'node:buffer'
import { getPayload } from 'payload'

const allowedCategories = new Set(['tapping', 'whisper', 'nature', 'roleplay', 'texture'])
const allowedMimeTypes = new Set([
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/ogg',
  'audio/wav',
  'audio/x-wav',
  'audio/webm',
])
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
// Vercel 每次請求上限約 4.5 MB：音檔最多 4 MB；封面在瀏覽器端已縮成約 1080px 的 JPEG（通常 < 300 KB）
const maxFileSize = 4 * 1024 * 1024
const maxCoverSize = 1024 * 1024
const maxTotalSize = 4.3 * 1024 * 1024

function readText(formData: FormData, name: string, maxLength: number) {
  const value = formData.get(name)
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return Response.json({ message: '請使用上傳表單送出音檔。' }, { status: 400 })
    }
    const formData = await request.formData()
    const title = readText(formData, 'title', 80)
    const creatorName = readText(formData, 'creatorName', 50)
    const origin = readText(formData, 'origin', 40)
    const description = readText(formData, 'description', 240)
    const category = readText(formData, 'category', 20)
    const audio = formData.get('audio')
    const coverEntry = formData.get('cover')
    const cover = coverEntry instanceof File && coverEntry.size > 0 ? coverEntry : null

    if (!title || !creatorName || !allowedCategories.has(category)) {
      return Response.json({ message: '請完整填寫作品名稱、創作者與聲音類型。' }, { status: 400 })
    }
    if (!(audio instanceof File) || audio.size === 0) {
      return Response.json({ message: '請選擇一個音檔。' }, { status: 400 })
    }
    if (!allowedMimeTypes.has(audio.type) || audio.size > maxFileSize) {
      return Response.json({ message: '音檔格式不支援，或檔案超過 4 MB。' }, { status: 400 })
    }
    if (cover && (!allowedImageTypes.has(cover.type) || cover.size > maxCoverSize)) {
      return Response.json({ message: '封面請使用 JPG、PNG 或 WebP 圖片。' }, { status: 400 })
    }
    if (audio.size + (cover?.size ?? 0) > maxTotalSize) {
      return Response.json(
        { message: '音檔加封面太大了，請把音檔剪短一點再上傳。' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // 封面先存起來（不公開），等聲音審核通過才會出現在網站上
    let coverId: number | undefined
    if (cover) {
      const ext = cover.type === 'image/png' ? 'png' : cover.type === 'image/webp' ? 'webp' : 'jpg'
      const coverDoc = await payload.create({
        collection: 'asmr-covers',
        overrideAccess: true,
        data: { visible: false },
        file: {
          data: Buffer.from(await cover.arrayBuffer()),
          mimetype: cover.type,
          name: `cover-${Date.now()}.${ext}`,
          size: cover.size,
        },
      })
      coverId = coverDoc.id
    }

    try {
      await payload.create({
        collection: 'asmr-tracks',
        draft: false,
        overrideAccess: false,
        context: { publicAsmrUpload: true },
        data: {
          title,
          creatorName,
          origin,
          category: category as 'tapping' | 'whisper' | 'nature' | 'roleplay' | 'texture',
          description,
          status: 'pending',
          featured: false,
          ...(coverId ? { cover: coverId } : {}),
        },
        file: {
          data: Buffer.from(await audio.arrayBuffer()),
          mimetype: audio.type,
          name: audio.name.replace(/[^a-zA-Z0-9._-]/g, '-'),
          size: audio.size,
        },
      })
    } catch (error) {
      // 聲音存失敗的話，把剛剛存的封面也刪掉，避免留下沒人用的圖片
      if (coverId)
        await payload
          .delete({ collection: 'asmr-covers', id: coverId, overrideAccess: true })
          .catch(() => {})
      throw error
    }

    return Response.json(
      { message: '上傳完成！聲音會在審核通過後出現在資料庫中。' },
      { status: 201 },
    )
  } catch {
    return Response.json({ message: '上傳失敗，請稍後再試。' }, { status: 500 })
  }
}
