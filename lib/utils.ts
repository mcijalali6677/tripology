import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* ─── Currency Formatting ─── */
const CAD_TO_TOMAN = 38_000 // 1 CAD ≈ 38,000 Toman (approximate)

/**
 * Format a price with the correct currency for the current locale.
 * When locale is "fa", amounts are assumed to already be in Toman
 * for Iranian-origin data, or converted from CAD for international data.
 */
export function formatPrice(
  amount: number,
  locale: string,
  opts?: { compact?: boolean; unit?: boolean }
): string {
  const { compact = false, unit = true } = opts ?? {}

  if (locale === "fa") {
    // Format in Persian digits with Toman label
    const formatted = amount.toLocaleString("fa-IR")
    return unit ? `${formatted} تومان` : formatted
  }
  // Default: CAD / USD style
  if (compact) {
    return unit ? `$${amount.toLocaleString()}` : amount.toLocaleString()
  }
  return `$${amount.toLocaleString()}`
}

/**
 * Convert a CAD amount to Toman (for pricing, checkout, etc.)
 */
export function cadToToman(cad: number): number {
  return Math.round(cad * CAD_TO_TOMAN)
}

/**
 * Get the currency label for the locale.
 */
export function getCurrencyLabel(locale: string): string {
  return locale === "fa" ? "تومان" : "CAD"
}

/**
 * Get the currency symbol for the locale.
 */
export function getCurrencySymbol(locale: string): string {
  return locale === "fa" ? "تومان" : "$"
}
