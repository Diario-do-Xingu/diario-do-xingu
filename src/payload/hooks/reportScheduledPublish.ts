import * as Sentry from '@sentry/nextjs'
import type { PayloadRequest, TaskConfig } from 'payload'

/** Named so the server's tracesSampler can keep every one of these rather than one in ten. */
export const SCHEDULED_PUBLISH_SPAN = 'scheduled publish'

/** A scheduled publish this far behind its slot is worth a look, not just a data point. */
const LATE_AFTER_SECONDS = 5 * 60

/**
 * `onSuccess` for the schedulePublish task: records what was published, when it was meant to go
 * out, and how late it actually ran.
 *
 * "Did the 6am article go out at 6am?" was previously unanswerable - the queue leaves no trace
 * when it works. The span carries the measurement for charting; anything more than a few minutes
 * behind also raises an event, since by then an editor has noticed.
 */
export const reportScheduledPublish: NonNullable<TaskConfig['onSuccess']> = async ({
  job,
  input,
  req,
}) => {
  const scheduledFor = typeof job.waitUntil === 'string' ? job.waitUntil : undefined
  const scheduledAt = scheduledFor ? Date.parse(scheduledFor) : Number.NaN
  if (Number.isNaN(scheduledAt)) return

  const lagSeconds = Math.round((Date.now() - scheduledAt) / 1000)
  const onTime = lagSeconds < LATE_AFTER_SECONDS
  const { collection, id } = target(input)
  // A few scheduled publishes a day, so one small read to name the document is worth it: a slug
  // answers "which article was late?", which an id does not.
  const slug = await slugOf(req, collection, id)

  // A span rather than an event: this is a measurement on every publish, and events would group
  // into one noisy issue instead of a series that can be charted.
  Sentry.startSpan(
    {
      name: SCHEDULED_PUBLISH_SPAN,
      op: 'queue.task.schedulePublish',
      attributes: {
        lag_seconds: lagSeconds,
        collection,
        doc_slug: slug,
        scheduled_for: scheduledFor,
        on_time: onTime,
      },
    },
    () => {},
  )

  if (!onTime) {
    // The message stays constant so every late publish lands in one issue: putting the slug or
    // the delay in the text would open a fresh issue each time and defeat alerting on it.
    Sentry.captureMessage('Scheduled publish ran late', {
      level: 'warning',
      tags: { job: 'schedulePublish', collection, doc_slug: slug },
      extra: { scheduledFor, lagSeconds, lateBy: `${Math.round(lagSeconds / 60)} min` },
    })
  }
}

/** The task input carries a reference to the document being published. */
const target = (input: unknown) => {
  const doc = (input as { doc?: { relationTo?: unknown; value?: unknown } } | null)?.doc
  return {
    collection: typeof doc?.relationTo === 'string' ? doc.relationTo : 'unknown',
    id: typeof doc?.value === 'string' || typeof doc?.value === 'number' ? doc.value : undefined,
  }
}

/** Falls back to the id, and then to a placeholder: naming the document is best-effort. */
const slugOf = async (req: PayloadRequest, collection: string, id: string | number | undefined) => {
  if (id === undefined || collection === 'unknown') return 'unknown'

  try {
    const doc = await req.payload.findByID({
      collection: collection as Parameters<typeof req.payload.findByID>[0]['collection'],
      id,
      depth: 0,
      select: { slug: true },
      disableErrors: true,
      req,
    })
    const slug = (doc as { slug?: unknown } | null)?.slug
    return typeof slug === 'string' ? slug : String(id)
  } catch {
    return String(id)
  }
}
