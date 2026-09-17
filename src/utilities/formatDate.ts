import { capitalizeWords } from './formatString'

export function writingDate(timestamp: number) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }

  return capitalizeWords(new Intl.DateTimeFormat('pt-BR', options).format(timestamp))
}

/**
 * `15 de janeiro de 2026` in São Paulo time, for date pickers and labels.
 */
export function longDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(date)
}

/**
 * Reads a `yyyy-MM-dd` string as that day in the browser's own timezone, which is what a date
 * picker means by it. `new Date('2026-01-15')` would read it as UTC midnight and can land on
 * the previous day west of Greenwich. Returns undefined for anything that is not a real date.
 */
export function parseLocalDay(day: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day)
  if (!match) return undefined

  const [, year, month, date] = match.map(Number)
  const parsed = new Date(year, month - 1, date)
  // Rolls over for impossible dates (Feb 30 becomes March 1), so check the parts survived.
  return parsed.getMonth() === month - 1 && parsed.getDate() === date ? parsed : undefined
}

/** `yyyy-MM-dd` for a Date, as the search URL carries it. */
export function toLocalDayString(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function formatDateWithTime(dateStr: string, dateTimeSeparator: string = ',') {
  const date = new Date(dateStr)

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  })

  return formatter.format(date).replace(':', 'h').replace(',', dateTimeSeparator)
}

export function formatDateAndRelative(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()

  const formattedDate = formatDateWithTime(dateStr)

  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHr / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  let relative: string

  if (diffMin < 1) {
    relative = 'Atualizado agora'
  } else if (diffMin < 60) {
    relative = `Há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`
  } else if (diffHr < 24) {
    relative = `Há ${diffHr} hora${diffHr > 1 ? 's' : ''}`
  } else if (diffDays < 30) {
    relative = `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
  } else if (diffDays < 365) {
    // "mês" loses its circumflex in the plural, so it cannot take a suffix like the others
    relative = `Há ${diffMonths} ${diffMonths > 1 ? 'meses' : 'mês'}`
  } else {
    relative = `Há ${diffYears} ano${diffYears > 1 ? 's' : ''}`
  }

  return `${formattedDate} - ${relative}`
}

/**
 * UTC bounds of one calendar day (`yyyy-MM-dd`) in São Paulo, for `publishedAt` queries.
 * Brazil has had no daylight saving since 2019, so the offset is fixed. Returns undefined
 * for anything that is not a real date.
 */
export function saoPauloDayRange(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return undefined
  const start = new Date(`${day}T00:00:00.000-03:00`)
  // Midnight in São Paulo is 03:00Z of the same date, so a valid input round-trips exactly;
  // `new Date('2026-02-30…')` silently rolls over to March and fails this comparison.
  if (Number.isNaN(start.getTime()) || !start.toISOString().startsWith(day)) return undefined
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 1)
  return { greater_than_equal: start.toISOString(), less_than: end.toISOString() }
}
