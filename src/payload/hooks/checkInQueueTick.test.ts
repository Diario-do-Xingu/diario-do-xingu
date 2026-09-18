import type { Payload } from 'payload'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkInQueueTick, QUEUE_DEPTH_SPAN, QUEUE_MONITOR_SLUG } from './checkInQueueTick'

const captureCheckIn = vi.fn()
const startSpan = vi.fn()
vi.mock('@sentry/nextjs', () => ({
  captureCheckIn: (...args: unknown[]) => captureCheckIn(...args),
  startSpan: (...args: unknown[]) => startSpan(...args),
}))

const count = vi.fn()
const warn = vi.fn()
const payload = { count, logger: { warn } } as unknown as Payload

/** Runs the tick at a given UTC minute: depth is only measured on multiples of five. */
const tickAt = (minute: number) => {
  vi.setSystemTime(new Date(Date.UTC(2026, 8, 18, 12, minute)))
  return checkInQueueTick(payload)
}

beforeEach(() => {
  vi.useFakeTimers()
  count.mockResolvedValueOnce({ totalDocs: 2 }).mockResolvedValueOnce({ totalDocs: 7 })
})
afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('checkInQueueTick', () => {
  it('checks in as ok on the minute schedule and still lets the tick run', async () => {
    await expect(tickAt(3)).resolves.toBe(true)

    expect(captureCheckIn).toHaveBeenCalledWith(
      { monitorSlug: QUEUE_MONITOR_SLUG, status: 'ok' },
      expect.objectContaining({ schedule: { type: 'crontab', value: '* * * * *' } }),
    )
  })

  it('measures due and scheduled jobs on every fifth minute', async () => {
    await tickAt(15)

    expect(count).toHaveBeenCalledTimes(2)
    expect(startSpan).toHaveBeenCalledWith(
      expect.objectContaining({
        name: QUEUE_DEPTH_SPAN,
        attributes: { jobs_due: 2, jobs_scheduled: 7 },
      }),
      expect.any(Function),
    )
  })

  it('skips the measurement on the other minutes', async () => {
    await tickAt(16)

    expect(count).not.toHaveBeenCalled()
    expect(startSpan).not.toHaveBeenCalled()
  })

  it('still lets the tick run when counting fails', async () => {
    count.mockReset().mockRejectedValue(new Error('db away'))

    await expect(tickAt(20)).resolves.toBe(true)
    expect(warn).toHaveBeenCalledOnce()
    expect(startSpan).not.toHaveBeenCalled()
  })
})
