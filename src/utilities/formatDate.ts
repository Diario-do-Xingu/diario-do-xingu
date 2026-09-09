import { capitalizeWords } from './formatString'

export function writingDate(timestamp: number) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }

  return capitalizeWords(new Intl.DateTimeFormat('pt-BR', options).format(timestamp))
}

export const formatDate = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1
  const DD = days < 10 ? `0${days}` : days
  const YYYY = date.getFullYear()
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${DD}/${MM}/${YYYY}`
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
    relative = `Há ${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`
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
