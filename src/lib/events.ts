'use client'

/**
 * 不同區塊之間的小訊號，例如測驗結果「幫我套用混音配方」「幫我篩選資料庫」。
 */

export const MIX_EVENT = 'checkout:apply-mix'
export const FILTER_EVENT = 'checkout:filter-library'

export function requestMix(presetName: string) {
  window.dispatchEvent(new CustomEvent(MIX_EVENT, { detail: presetName }))
}

export function requestFilter(category: string) {
  window.dispatchEvent(new CustomEvent(FILTER_EVENT, { detail: category }))
}

export function listen(name: string, handler: (detail: string) => void) {
  const fn = (e: Event) => handler((e as CustomEvent<string>).detail)
  window.addEventListener(name, fn)
  return () => window.removeEventListener(name, fn)
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
