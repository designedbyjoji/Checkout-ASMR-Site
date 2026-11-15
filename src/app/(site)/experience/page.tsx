import { redirect } from 'next/navigation'

/** /experience 本身沒有內容，直接跳到第一個子分頁 */
export default function Page() {
  redirect('/experience/match')
}
