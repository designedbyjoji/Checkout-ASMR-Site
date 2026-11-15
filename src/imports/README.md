# src/imports — 外部檔案專用資料夾

這裡放「從外部拿進來」的素材，例如 Figma 匯出的 Logo、插圖。

## Logo
- 檔名固定為 `checkout-logo.svg`。用同名檔案覆蓋，全站的 Logo 就會一起換掉。
- 顏色不用管：網站會自動把 Logo 染成文字顏色（深色背景會是白色）。
- 如果你的 SVG **已經包含「Checkout.」字樣**，請到
  `src/app/(frontend)/components/ui/CheckoutLogo.tsx`，把 `LOGO_HAS_WORDMARK` 改成 `true`，
  避免文字重複出現。
