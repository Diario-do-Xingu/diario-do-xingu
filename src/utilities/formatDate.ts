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

export const formatDateTime = (timestamp: string): string => {
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

export function formatDateAndRelative(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  })

  const formattedDate = formatter.format(date).replace(':', 'h')

  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHr / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  let relative

  if (diffMin < 1) {
    relative = 'Atualizado agora'
  } else if (diffMin < 60) {
    relative = `Atualizado há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`
  } else if (diffHr < 24) {
    relative = `Atualizado há ${diffHr} hora${diffHr > 1 ? 's' : ''}`
  } else if (diffDays < 30) {
    relative = `Atualizado há ${diffDays} dia${diffDays > 1 ? 's' : ''}`
  } else if (diffDays < 365) {
    relative = `Atualizado há ${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`
  } else {
    relative = `Atualizado há ${diffYears} ano${diffYears > 1 ? 's' : ''}`
  }

  return `${formattedDate} - ${relative}`
}
