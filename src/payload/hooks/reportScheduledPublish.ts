import * as Sentry from '@sentry/nextjs'
import type { TaskConfig } from 'payload'

/** A scheduled publish this far behind its slot is worth a look, not just a data point. */
const LATE_AFTER_SECONDS = 5 * 60

/**
 * `onSuccess` for the schedulePublish task: records how late the publish actually ran.
 *
 * "Did the 6am article go out at 6am?" was previously unanswerable — the queue leaves no trace
 * when it works. The span carries the lag as an attribute so it can be charted, and anything
 * more than a few minutes behind also raises an event, since by then an editor has noticed.
 */
export const reportScheduledPublish: NonNullable<TaskConfig['onSuccess']> = ({ job, input }) => {
  const scheduledFor = typeof job.waitUntil === 'string' ? Date.parse(job.waitUntil) : Number.NaN
  if (Number.isNaN(scheduledFor)) return

  const lagSeconds = Math.round((Date.now() - scheduledFor) / 1000)
  const collection = collectionOf(input)

  // A span rather than an event: this is a measurement on every publish, and events would
  // group into one noisy issue instead of a series you can chart.
  Sentry.startSpan(
    {
      name: 'scheduled publish',
      op: 'queue.task.schedulePublish',
      attributes: { lag_seconds: lagSeconds, collection },
    },
    () => {},
  )

  if (lagSeconds >= LATE_AFTER_SECONDS) {
    Sentry.captureMessage(`Scheduled publish ran ${lagSeconds}s late`, {
      level: 'warning',
      tags: { job: 'schedulePublish', collection },
      extra: { scheduledFor: job.waitUntil, lagSeconds },
    })
  }
}

/** The task input carries the document it is publishing; the slug is the useful part. */
const collectionOf = (input: unknown) => {
  const doc = (input as { doc?: { relationTo?: unknown } } | null)?.doc
  return typeof doc?.relationTo === 'string' ? doc.relationTo : 'unknown'
}
