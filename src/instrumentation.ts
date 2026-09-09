import * as Sentry from '@sentry/nextjs'

/**
 * Runs once when the Next server boots.
 *
 * Sentry is initialised first so anything below it, and every request after, is reported.
 * Initialising Payload here starts the job queue's autoRun crons immediately, so scheduled
 * publishes run on time after a deploy; without it the crons only start on the first request
 * that executes server code, and on a fully cached site that can be hours later.
 *
 * Nothing here may take the server down (Next exits on a throwing register): a broken Sentry
 * env leaves reporting off, and a Payload failure is logged; the wrapper's `cron: true` then
 * starts the crons on first use.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  try {
    await import('./sentry.server.config')
  } catch (error) {
    console.error('Sentry could not initialise; error reporting is off.', error)
  }

  try {
    const { getPayload } = await import('@/lib/payload/getPayload')
    await getPayload()
  } catch (error) {
    Sentry.captureException(error)
    console.error('Payload could not initialise at boot; job crons will start on first use.', error)
  }
}

// Uncaught errors from pages, layouts, route handlers and server actions.
export const onRequestError = Sentry.captureRequestError
