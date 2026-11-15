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
// Vercel 每次請求上限約 4.5 MB，所以這裡限制 4 MB
const maxFileSize = 4 * 1024 * 1024

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

    if (!title || !creatorName || !allowedCategories.has(category)) {
      return Response.json({ message: '請完整填寫作品名稱、創作者與聲音類型。' }, { status: 400 })
    }
    if (!(audio instanceof File) || audio.size === 0) {
      return Response.json({ message: '請選擇一個音檔。' }, { status: 400 })
    }
    if (!allowedMimeTypes.has(audio.type) || audio.size > maxFileSize) {
      return Response.json({ message: '音檔格式不支援，或檔案超過 4 MB。' }, { status: 400 })
    }

    const payload = await getPayload({ config })
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
      },
      file: {
        data: Buffer.from(await audio.arrayBuffer()),
        mimetype: audio.type,
        name: audio.name.replace(/[^a-zA-Z0-9._-]/g, '-'),
        size: audio.size,
      },
    })

    return Response.json(
      { message: '上傳完成！聲音會在審核通過後出現在資料庫中。' },
      { status: 201 },
    )
  } catch {
    return Response.json({ message: '上傳失敗，請稍後再試。' }, { status: 500 })
  }
}
