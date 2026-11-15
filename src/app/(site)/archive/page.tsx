import { redirect } from 'next/navigation'

/** /archive 本身沒有內容，直接跳到第一個子分頁 */
export default function Page() {
  redirect('/archive/glossary')
}
