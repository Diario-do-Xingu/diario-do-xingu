import * as Sentry from '@sentry/nextjs'
import type { JobsConfig } from 'payload'

export const QUEUE_MONITOR_SLUG = 'payload-jobs-autorun'

/**
 * `jobs.shouldAutoRun`: always lets the tick run, and tells Sentry Crons that it happened.
 *
 * The queue runner is what publishes scheduled articles; if it stops (a crashed process, a boot
 * where Payload never initialised) nothing else notices until an editor asks why the 6am piece
 * is still a draft. A missed check-in turns that silence into an alert. The monitor is upserted
 * from here, so no setup is needed in the Sentry UI, and Sentry is inert outside production.
 */
export const checkInQueueTick: NonNullable<JobsConfig['shouldAutoRun']> = () => {
  Sentry.captureCheckIn(
    { monitorSlug: QUEUE_MONITOR_SLUG, status: 'ok' },
    {
      schedule: { type: 'crontab', value: '* * * * *' },
      // Minutes. A single slow tick is not an incident; three in a row is.
      checkinMargin: 2,
      maxRuntime: 5,
      failureIssueThreshold: 3,
      recoveryThreshold: 1,
      timezone: 'UTC',
    },
  )

  return true
}
