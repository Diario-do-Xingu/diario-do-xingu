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

const findByID = vi.fn()

const ran = ({
  secondsLate = 0,
  waitUntil,
  doc = { relationTo: 'news', value: 'abc123' },
}: {
  secondsLate?: number
  waitUntil?: string | null
  doc?: unknown
} = {}) =>
  reportScheduledPublish({
    job: { waitUntil: waitUntil ?? new Date(Date.now() - secondsLate * 1000).toISOString() },
    input: { doc },
    req: { payload: { findByID } },
  } as unknown as Args)

const attributes = () => startSpan.mock.calls[0]?.[0]?.attributes

beforeEach(() => {
  vi.clearAllMocks()
  findByID.mockResolvedValue({ slug: 'chuva-no-xingu' })
})

describe('reportScheduledPublish', () => {
  it('records which document went out, when it was due and how late it was', async () => {
    const due = new Date(Date.now() - 42_000).toISOString()
    await ran({ waitUntil: due })

    expect(attributes()).toMatchObject({
      lag_seconds: 42,
      collection: 'news',
      doc_slug: 'chuva-no-xingu',
      scheduled_for: due,
      on_time: true,
    })
  })

  it('marks a publish past the threshold as not on time', async () => {
    await ran({ secondsLate: 11 * 60 })

    expect(attributes()).toMatchObject({ on_time: false })
  })

  it('keeps the warning message constant so late publishes group into one issue', async () => {
    await ran({ secondsLate: 11 * 60 })

    expect(captureMessage).toHaveBeenCalledWith(
      'Scheduled publish ran late',
      expect.objectContaining({
        level: 'warning',
        tags: expect.objectContaining({ doc_slug: 'chuva-no-xingu', collection: 'news' }),
      }),
    )
  })

  it('stays quiet when the publish was on time', async () => {
    await ran({ secondsLate: 30 })

    expect(captureMessage).not.toHaveBeenCalled()
  })

  it('falls back to the id when the document cannot be read', async () => {
    findByID.mockResolvedValue(null)
    await ran()

    expect(attributes()).toMatchObject({ doc_slug: 'abc123' })
  })

  it('does not read the database when the input has no document', async () => {
    await ran({ doc: null })

    expect(findByID).not.toHaveBeenCalled()
    expect(attributes()).toMatchObject({ collection: 'unknown', doc_slug: 'unknown' })
  })

  it('does nothing for a job with no scheduled time to compare against', async () => {
    await ran({ waitUntil: 'not a date' })

    expect(startSpan).not.toHaveBeenCalled()
    expect(captureMessage).not.toHaveBeenCalled()
  })
})
