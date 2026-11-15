import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-8 text-center">
      <p className="kicker">404 · Silence</p>
      <h1 className="mt-6 text-4xl font-light tracking-wide">這裡太安靜了</h1>
      <p className="mt-4 text-mist/60">你要找的頁面不存在，或已經被移走。</p>
      <Link href="/" className="btn-ghost mt-10">
        回到首頁
      </Link>
    </main>
  )
}
