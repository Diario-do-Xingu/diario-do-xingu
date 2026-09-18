import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import { checkInQueueTick, QUEUE_MONITOR_SLUG } from './checkInQueueTick'

const captureCheckIn = vi.fn()
vi.mock('@sentry/nextjs', () => ({
  captureCheckIn: (...args: unknown[]) => captureCheckIn(...args),
}))

describe('checkInQueueTick', () => {
  it('checks in as ok on the minute schedule and still lets the tick run', () => {
    expect(checkInQueueTick({} as Payload)).toBe(true)

    expect(captureCheckIn).toHaveBeenCalledWith(
      { monitorSlug: QUEUE_MONITOR_SLUG, status: 'ok' },
      expect.objectContaining({ schedule: { type: 'crontab', value: '* * * * *' } }),
    )
  })
})
