'use client'

import { useEffect, useRef, useState } from 'react'
import { categoryLabels } from '../../content'
import { Icon } from '../ui/Icon'

// Vercel 每次請求上限約 4.5 MB；約等於 4 分鐘的 128kbps MP3
const MAX_MB = 4
const ACCEPT = 'audio/mpeg,audio/mp4,audio/x-m4a,audio/ogg,audio/wav,audio/x-wav,audio/webm'

export function UploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [fileName, setFileName] = useState('')
  const firstField = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setMessage(null)
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => firstField.current?.focus(), 200)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // 先把表單存起來：await 之後 event.currentTarget 會變成 null（原版的 bug）
    const form = event.currentTarget
    const data = new FormData(form)
    const file = data.get('audio')
    if (file instanceof File && file.size > MAX_MB * 1024 * 1024) {
      setMessage({ ok: false, text: `檔案超過 ${MAX_MB} MB，請剪短一點，或轉成 MP3 / M4A 再上傳。` })
      return
    }

    setUploading(true)
    setMessage(null)
    try {
      const response = await fetch('/submit-track', { method: 'POST', body: data })
      const result = (await response.json().catch(() => ({}))) as { message?: string }
      if (response.ok) {
        form.reset()
        setFileName('')
        setMessage({ ok: true, text: result.message ?? '上傳完成，審核通過後就會出現在資料庫。' })
      } else {
        setMessage({ ok: false, text: result.message ?? '上傳時發生問題，請稍後再試。' })
      }
    } catch {
      setMessage({ ok: false, text: '網路好像斷了，請確認連線後再試一次。' })
    } finally {
      setUploading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-night/70 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border border-white/10 bg-deep/95 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[2rem] sm:p-9">
        <div className="flex items-start justify-between">
          <div>
            <p className="kicker">Contribute</p>
            <h2 id="upload-title" className="mt-3 text-3xl font-light">
              分享你的聲音
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full border border-white/15 text-mist/70 hover:text-mist"
            aria-label="關閉上傳視窗"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="field-label">作品名稱 *</span>
            <input ref={firstField} name="title" required maxLength={80} className="field-input" placeholder="例如：清晨翻書聲" />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">創作者名稱 *</span>
              <input name="creatorName" required maxLength={50} className="field-input" placeholder="你的稱呼" />
            </label>
            <label className="block">
              <span className="field-label">錄製地點</span>
              <input name="origin" maxLength={40} className="field-input" placeholder="例如：台灣・台北" />
            </label>
          </div>
          <label className="block">
            <span className="field-label">聲音類型 *</span>
            <select name="category" required className="field-input" defaultValue="tapping">
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">聲音描述</span>
            <textarea
              name="description"
              maxLength={240}
              className="field-input min-h-24 resize-none"
              placeholder="這段聲音是怎麼錄的？適合什麼時候聽？"
            />
          </label>

          <label className="block cursor-pointer rounded-2xl border border-dashed border-white/20 p-6 text-center transition-colors hover:border-aurora-mint/50 hover:bg-white/[0.03]">
            <Icon name="upload" className="mx-auto size-6 text-aurora-mint" />
            <span className="mt-3 block text-sm font-medium">{fileName || '選擇音檔'}</span>
            <span className="mt-1 block text-xs text-mist/45">MP3、M4A、WAV、OGG 或 WebM，最大 {MAX_MB} MB</span>
            <input
              name="audio"
              required
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
            />
          </label>

          {message && (
            <p
              role="status"
              className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                message.ok ? 'bg-aurora-mint/10 text-aurora-mint' : 'bg-aurora-rose/10 text-aurora-rose'
              }`}
            >
              {message.text}
            </p>
          )}

          <button disabled={uploading} className="btn-primary w-full disabled:opacity-50">
            {uploading ? '正在上傳⋯' : '送出審核'} <Icon name="arrow" className="size-4" />
          </button>
          <p className="text-center text-[11px] leading-5 text-mist/40">
            送出即表示你擁有這段聲音的分享權利。內容會在審核通過後公開。
          </p>
        </form>
      </div>
    </div>
  )
}
