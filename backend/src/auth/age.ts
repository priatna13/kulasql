const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

// The date input is a calendar day. WIB, not UTC, so a 13th birthday morning in Jakarta is not still yesterday.
function todayInJakarta(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return `${pick('year')}-${pick('month')}-${pick('day')}`
}

export function parseIsoDate(value: string): { year: number; month: number; day: number } | null {
  const match = ISO_DATE.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const utc = new Date(Date.UTC(year, month - 1, day))
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
    return null
  }
  return { year, month, day }
}

export function isAtLeast13(birthDate: string, today = todayInJakarta()): boolean {
  const birth = parseIsoDate(birthDate)
  const now = parseIsoDate(today)
  if (!birth || !now) return false
  let age = now.year - birth.year
  if (now.month < birth.month || (now.month === birth.month && now.day < birth.day)) age -= 1
  return age >= 13
}
