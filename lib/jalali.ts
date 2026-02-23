/**
 * Lightweight Gregorian ↔ Jalali (Shamsi) date converter.
 * No external dependency required.
 *
 * Algorithm based on the well-known Jalaali-JS conversion tables.
 */

export const PERSIAN_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد",
  "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر",
  "دی", "بهمن", "اسفند",
]

export const PERSIAN_WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

/** Convert a latin digit string to Persian digits */
export function toPersianDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)])
}

/** Core Gregorian → Jalali conversion */
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  let gy2 = gm > 2 ? gy + 1 : gy
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1]
  let jy = -1595 + 33 * Math.floor(days / 12053)
  days %= 12053
  jy += 4 * Math.floor(days / 1461)
  days %= 1461
  if (days > 365) {
    jy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }
  let jm: number
  if (days < 186) {
    jm = 1 + Math.floor(days / 31)
    const jd = 1 + (days % 31)
    return [jy, jm, jd]
  } else {
    jm = 7 + Math.floor((days - 186) / 30)
    const jd = 1 + ((days - 186) % 30)
    return [jy, jm, jd]
  }
}

/** Core Jalali → Gregorian conversion */
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  jy += 1595
  let days = -355668 + (365 * jy) + (Math.floor(jy / 33) * 8) + Math.floor(((jy % 33) + 3) / 4) + jd
  if (jm < 7) {
    days += (jm - 1) * 31
  } else {
    days += ((jm - 7) * 30) + 186
  }
  let gy = 400 * Math.floor(days / 146097)
  days %= 146097
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524)
    days %= 36524
    if (days >= 365) days++
  }
  gy += 4 * Math.floor(days / 1461)
  days %= 1461
  if (days > 365) {
    gy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }
  const gd_m = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let gm = 0
  for (gm = 0; gm < 13 && days >= gd_m[gm]; gm++) {
    days -= gd_m[gm]
  }
  return [gy, gm, days + 1]
}

/** Check if Jalali year is leap */
export function isJalaliLeap(jy: number): boolean {
  const breaks = [1, 5, 9, 13, 17, 22, 26, 30]
  return breaks.includes(jy % 33)
}

/** Get number of days in a Jalali month */
export function jalaliMonthDays(jy: number, jm: number): number {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  return isJalaliLeap(jy) ? 30 : 29
}

/** Get day of week (0=Saturday, 6=Friday) for a Jalali date */
export function jalaliDayOfWeek(jy: number, jm: number, jd: number): number {
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd)
  const d = new Date(gy, gm - 1, gd)
  // JS getDay: 0=Sun, 6=Sat. We want 0=Sat
  return (d.getDay() + 1) % 7
}

/** Convert a gregorian date string (YYYY-MM-DD) to jalali string (YYYY/MM/DD) */
export function gregorianStrToJalaliStr(dateStr: string): string {
  const [gy, gm, gd] = dateStr.split("-").map(Number)
  const [jy, jm, jd] = gregorianToJalali(gy, gm, gd)
  return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`
}

/** Convert a jalali date string to gregorian date string (YYYY-MM-DD) */
export function jalaliStrToGregorianStr(jy: number, jm: number, jd: number): string {
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd)
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`
}

/** Get Jalali month name */
export function getJalaliMonthName(jm: number): string {
  return PERSIAN_MONTHS[jm - 1] || ""
}

/**
 * Format a JS Date into a Jalali string.
 *
 * @param date - The Date object to format
 * @param style - "short" → "۲ بهمن", "long" → "۲ بهمن ۱۴۰۴", "monthYear" → "بهمن ۱۴۰۴"
 */
export function formatJalali(
  date: Date,
  style: "short" | "long" | "monthYear" = "long"
): string {
  const [jy, jm, jd] = gregorianToJalali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )

  switch (style) {
    case "short":
      return `${toPersianDigits(jd)} ${PERSIAN_MONTHS[jm - 1]}`
    case "monthYear":
      return `${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`
    case "long":
    default:
      return `${toPersianDigits(jd)} ${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`
  }
}

/**
 * Convert an English month-year string (e.g. "February 2026") to Jalali.
 * Returns the Jalali month-year, e.g. "بهمن ۱۴۰۴".
 */
export function englishDateToJalali(dateStr: string): string {
  const months: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4,
    may: 5, june: 6, july: 7, august: 8,
    september: 9, october: 10, november: 11, december: 12,
    jan: 1, feb: 2, mar: 3, apr: 4,
    jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  }

  const parts = dateStr.trim().split(/\s+/)
  if (parts.length < 2) return dateStr

  const monthKey = parts[0].toLowerCase()
  const year = parseInt(parts[1], 10)
  const month = months[monthKey]

  if (!month || isNaN(year)) return dateStr

  // Use the 15th of the month as a representative date
  const [jy, jm] = gregorianToJalali(year, month, 15)
  return `${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`
}
