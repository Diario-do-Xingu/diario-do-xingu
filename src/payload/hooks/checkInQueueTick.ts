import * as Sentry from '@sentry/nextjs'
import type { JobsConfig, Payload, Where } from 'payload'

export const QUEUE_MONITOR_SLUG = 'payload-jobs-autorun'

/** Named so the server's tracesSampler keeps every one: each is a data point, not a sample. */
export const QUEUE_DEPTH_SPAN = 'queue depth'

/** Depth is measured on these minutes; every tick would be 1,440 spans a day for a slow-moving number. */
const DEPTH_EVERY_MINUTES = 5

const notDone: Where = { completedAt: { exists: false }, hasError: { not_equals: true } }

/** Jobs whose slot has passed and are still not done. Zero on a healthy tick; anything else for a few ticks means the runner is stuck. */
const dueJobs = (now: string): Where => ({
  and: [
    notDone,
    { or: [{ waitUntil: { less_than_equal: now } }, { waitUntil: { exists: false } }] },
  ],
})

/** Jobs waiting for a future slot: the editors' publishing agenda. */
const scheduledJobs = (now: string): Where => ({
  and: [notDone, { waitUntil: { greater_than: now } }],
})

const countJobs = async (payload: Payload, where: Where) =>
  (await payload.count({ collection: 'payload-jobs', where })).totalDocs

/**
 * `jobs.shouldAutoRun`: always lets the tick run, and reports on the queue while it is here.
 *
 * Every tick checks in with Sentry Crons. The queue runner is what publishes scheduled articles;
 * if it stops (a crashed process, a boot where Payload never initialised) nothing else notices
 * until an editor asks why the 6am piece is still a draft. A missed check-in turns that silence
 * into an alert. The monitor is upserted from here, so no setup is needed in the Sentry UI, and
 * Sentry is inert outside production.
 *
 * Every fifth minute it also measures the queue: how many jobs are due but not done, and how
 * many are waiting for their slot. The cron monitor only proves the loop is alive; a runner that
 * ticks but never clears its backlog looks identical to it, and shows up here instead.
 */
export const checkInQueueTick: NonNullable<JobsConfig['shouldAutoRun']> = async (payload) => {
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

  const now = new Date()
  if (now.getUTCMinutes() % DEPTH_EVERY_MINUTES === 0) {
    try {
      const iso = now.toISOString()
      const [due, scheduled] = await Promise.all([
        countJobs(payload, dueJobs(iso)),
        countJobs(payload, scheduledJobs(iso)),
      ])
      Sentry.startSpan(
        {
          name: QUEUE_DEPTH_SPAN,
          op: 'queue.depth',
          attributes: { jobs_due: due, jobs_scheduled: scheduled },
        },
        () => {},
      )
    } catch (error) {
      // Measuring must never stop the tick itself; the jobs matter more than the chart.
      payload.logger.warn({ err: error, msg: 'Could not measure the job queue depth' })
    }
  }

  return true
}
