import * as Sentry from '@sentry/nextjs'
import type { TaskConfig } from 'payload'

/**
 * `onFail` for a task configured with `retries` attempts. Payload calls it on every failed
 * attempt and, right after, gives up when `totalTried >= retries`; this mirrors that rule
 * so Sentry hears about it exactly once, on the attempt that ends the job. Scheduled
 * publishes are the only jobs today, and a silent failure there means an article never
 * goes live.
 */
export const reportWhenRetriesExhausted =
  (retries: number): NonNullable<TaskConfig['onFail']> =>
  ({ job, taskStatus, input }) => {
    const previousAttempts = taskStatus?.totalTried ?? 0
    if (previousAttempts < retries) return

    // Payload writes the current attempt's error after this callback; the previous attempt's
    // failure is already in the log and is the same cause in practice.
    const lastLogged = job.log?.at(-1)?.error
    const name = job.taskSlug ?? 'unknown'

    Sentry.captureMessage(`Job ${name} failed after ${retries} retries`, {
      level: 'error',
      tags: { job: name, jobId: String(job.id) },
      extra: { input, attempts: previousAttempts + 1, lastError: lastLogged },
    })
  }
