import logo from '@/imports/checkout-logo.svg'

/**
 * Checkout. 標誌
 * ------------------------------------------------------------
 * 圖案來自 src/imports/checkout-logo.svg —— 換掉那個檔案，全站 Logo 就會一起更新。
 * 用「遮罩」的方式顯示：不管 SVG 原本是什麼顏色，都會被染成目前的文字顏色。
 *
 * 如果你的 SVG 已經包含「Checkout.」字樣，把下面改成 true，避免文字重複。
 */
const LOGO_HAS_WORDMARK = false

export function CheckoutLogo({ className = '', size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const height = size === 'lg' ? 'h-11 sm:h-12' : 'h-8 sm:h-9'
  const ratio = logo.width && logo.height ? logo.width / logo.height : 74 / 58

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden={!LOGO_HAS_WORDMARK}
        role={LOGO_HAS_WORDMARK ? 'img' : undefined}
        aria-label={LOGO_HAS_WORDMARK ? 'Checkout.' : undefined}
        className={`block shrink-0 bg-current ${height}`}
        style={{
          aspectRatio: String(ratio),
          WebkitMaskImage: `url(${logo.src})`,
          maskImage: `url(${logo.src})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
      {!LOGO_HAS_WORDMARK && (
        <span
          className={`font-display font-semibold tracking-[-0.03em] ${
            size === 'lg' ? 'text-[28px] sm:text-[32px]' : 'text-[22px] sm:text-2xl'
          }`}
        >
          Checkout.
        </span>
      )}
    </span>
  )
}
