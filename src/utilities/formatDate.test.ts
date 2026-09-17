import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  formatDateAndRelative,
  formatDateWithTime,
  longDate,
  parseLocalDay,
  saoPauloDayRange,
  toLocalDayString,
  writingDate,
} from './formatDate'

// São Paulo is UTC-3 year round (no DST since 2019), so 03:00Z is local midnight.
const SAO_PAULO_MIDNIGHT = '2026-01-15T03:00:00.000Z'

describe('writingDate', () => {
  it('writes the long pt-BR date in São Paulo time', () => {
    expect(writingDate(Date.parse('2026-01-15T15:00:00.000Z'))).toBe(
      'Quinta-feira, 15 De Janeiro De 2026',
    )
  })

  it('uses the São Paulo day, not the UTC one', () => {
    // 00:30Z on the 15th is still 21:30 of the 14th in São Paulo.
    expect(writingDate(Date.parse('2026-01-15T00:30:00.000Z'))).toBe(
      'Quarta-feira, 14 De Janeiro De 2026',
    )
  })
})

describe('formatDateWithTime', () => {
  it('formats as dd/mm/yyyy, HHhMM in São Paulo time', () => {
    expect(formatDateWithTime('2026-01-15T15:04:00.000Z')).toBe('15/01/2026, 12h04')
  })

  it('keeps midnight as 00h00 rather than 24h00', () => {
    expect(formatDateWithTime(SAO_PAULO_MIDNIGHT)).toBe('15/01/2026, 00h00')
  })

  it('swaps the comma for a custom separator', () => {
    expect(formatDateWithTime('2026-01-15T15:04:00.000Z', ' —')).toBe('15/01/2026 — 12h04')
  })
})

describe('formatDateAndRelative', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  /** Runs the formatter as if `agoMs` had passed since the article was published. */
  const relativePartAfter = (agoMs: number) => {
    const published = Date.parse('2026-01-15T15:04:00.000Z')
    vi.useFakeTimers({ now: published + agoMs })
    return formatDateAndRelative(new Date(published).toISOString()).split(' - ')[1]
  }

  const MINUTE = 60_000
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR

  it('keeps the absolute date in front of the relative part', () => {
    vi.useFakeTimers({ now: Date.parse('2026-01-15T15:04:00.000Z') })
    expect(formatDateAndRelative('2026-01-15T15:04:00.000Z')).toBe(
      '15/01/2026, 12h04 - Atualizado agora',
    )
  })

  it('singularises and pluralises each unit', () => {
    expect(relativePartAfter(0)).toBe('Atualizado agora')
    expect(relativePartAfter(59_000)).toBe('Atualizado agora')
    expect(relativePartAfter(MINUTE)).toBe('Há 1 minuto')
    expect(relativePartAfter(2 * MINUTE)).toBe('Há 2 minutos')
    expect(relativePartAfter(HOUR)).toBe('Há 1 hora')
    expect(relativePartAfter(2 * HOUR)).toBe('Há 2 horas')
    expect(relativePartAfter(DAY)).toBe('Há 1 dia')
    expect(relativePartAfter(2 * DAY)).toBe('Há 2 dias')
    expect(relativePartAfter(30 * DAY)).toBe('Há 1 mês')
    expect(relativePartAfter(60 * DAY)).toBe('Há 2 meses')
    expect(relativePartAfter(365 * DAY)).toBe('Há 1 ano')
    expect(relativePartAfter(730 * DAY)).toBe('Há 2 anos')
  })

  it('switches unit exactly on the boundary', () => {
    expect(relativePartAfter(59 * MINUTE)).toBe('Há 59 minutos')
    expect(relativePartAfter(23 * HOUR)).toBe('Há 23 horas')
    expect(relativePartAfter(29 * DAY)).toBe('Há 29 dias')
    // Months are 30-day buckets, so the last few days of the year read as "12 meses".
    expect(relativePartAfter(364 * DAY)).toBe('Há 12 meses')
  })

  it('reads a future timestamp as just updated', () => {
    expect(relativePartAfter(-HOUR)).toBe('Atualizado agora')
  })
})

describe('saoPauloDayRange', () => {
  it('spans local midnight to local midnight', () => {
    expect(saoPauloDayRange('2026-01-15')).toEqual({
      greater_than_equal: SAO_PAULO_MIDNIGHT,
      less_than: '2026-01-16T03:00:00.000Z',
    })
  })

  it('accepts a leap day', () => {
    expect(saoPauloDayRange('2024-02-29')?.greater_than_equal).toBe('2024-02-29T03:00:00.000Z')
  })

  it('rejects dates that only look valid', () => {
    expect(saoPauloDayRange('2026-02-30')).toBeUndefined()
    expect(saoPauloDayRange('2026-13-01')).toBeUndefined()
    expect(saoPauloDayRange('2025-02-29')).toBeUndefined()
  })

  it('rejects anything that is not yyyy-MM-dd', () => {
    expect(saoPauloDayRange('')).toBeUndefined()
    expect(saoPauloDayRange('15/01/2026')).toBeUndefined()
    expect(saoPauloDayRange('2026-1-5')).toBeUndefined()
    expect(saoPauloDayRange('2026-01-15T00:00:00Z')).toBeUndefined()
  })
})

describe('longDate', () => {
  it('writes the long pt-BR date for a calendar day', () => {
    expect(longDate(new Date(2026, 0, 15))).toBe('15 de janeiro de 2026')
  })

  it('round-trips with parseLocalDay, so a picked day survives a reload', () => {
    // The server runs on UTC and the reader may not; both must render the day that was picked.
    expect(longDate(parseLocalDay('2026-09-15') as Date)).toBe('15 de setembro de 2026')
  })
})

describe('parseLocalDay', () => {
  it('reads the day in the local timezone, not as UTC midnight', () => {
    const parsed = parseLocalDay('2026-01-15')

    expect(parsed?.getFullYear()).toBe(2026)
    expect(parsed?.getMonth()).toBe(0)
    expect(parsed?.getDate()).toBe(15)
    expect(parsed?.getHours()).toBe(0)
  })

  it('accepts a leap day', () => {
    expect(parseLocalDay('2024-02-29')?.getDate()).toBe(29)
  })

  it('rejects dates that only look valid', () => {
    expect(parseLocalDay('2026-02-30')).toBeUndefined()
    expect(parseLocalDay('2025-02-29')).toBeUndefined()
    expect(parseLocalDay('2026-13-01')).toBeUndefined()
  })

  it('rejects anything that is not yyyy-MM-dd', () => {
    expect(parseLocalDay('')).toBeUndefined()
    expect(parseLocalDay('15/01/2026')).toBeUndefined()
    expect(parseLocalDay('2026-1-5')).toBeUndefined()
  })
})

describe('toLocalDayString', () => {
  it('pads the month and day, and round-trips through parseLocalDay', () => {
    expect(toLocalDayString(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toLocalDayString(parseLocalDay('2026-11-30') as Date)).toBe('2026-11-30')
  })
})
