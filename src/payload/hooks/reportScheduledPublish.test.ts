import type { TaskConfig } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reportScheduledPublish } from './reportScheduledPublish'

const startSpan = vi.fn()
const captureMessage = vi.fn()
vi.mock('@sentry/nextjs', () => ({
  startSpan: (...args: unknown[]) => startSpan(...args),
  captureMessage: (...args: unknown[]) => captureMessage(...args),
}))

type Args = Parameters<NonNullable<TaskConfig['onSuccess']>>[0]

const ranAt = (secondsLate: number, waitUntil: string | null = null) => {
  const scheduled = waitUntil ?? new Date(Date.now() - secondsLate * 1000).toISOString()
  return reportScheduledPublish({
    job: { waitUntil: scheduled },
    input: { doc: { relationTo: 'news', value: '1' } },
  } as unknown as Args)
}

const spanAttributes = () => startSpan.mock.calls[0]?.[0]?.attributes

beforeEach(() => {
  vi.clearAllMocks()
})

describe('reportScheduledPublish', () => {
  it('records how late the publish ran, tagged with the collection', () => {
    ranAt(42)

    expect(spanAttributes()).toMatchObject({ lag_seconds: 42, collection: 'news' })
  })

  it('stays quiet when the publish was on time', () => {
    ranAt(30)

    expect(captureMessage).not.toHaveBeenCalled()
  })

  it('raises a warning once the delay is one an editor would notice', () => {
    ranAt(11 * 60)

    expect(captureMessage).toHaveBeenCalledWith(
      expect.stringContaining('late'),
      expect.objectContaining({ level: 'warning' }),
    )
  })

  it('does nothing for a job with no scheduled time to compare against', () => {
    ranAt(0, 'not a date')

    expect(startSpan).not.toHaveBeenCalled()
    expect(captureMessage).not.toHaveBeenCalled()
  })

  it('falls back to a placeholder when the input carries no collection', () => {
    reportScheduledPublish({
      job: { waitUntil: new Date().toISOString() },
      input: {},
    } as unknown as Args)

    expect(spanAttributes()).toMatchObject({ collection: 'unknown' })
  })
})
