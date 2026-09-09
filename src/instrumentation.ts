/**
 * Runs once when the Next server boots. Initialising Payload here starts the job queue's
 * autoRun crons immediately, so scheduled publishes run on time after a deploy. Without
 * it the crons only start on the first request that executes server code, and on a fully
 * cached site that can be hours later.
 *
 * A failure here must not take the server down (Next exits on a throwing register), so it
 * is logged instead; the wrapper's `cron: true` then starts the crons on first use.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  try {
    const { getPayload } = await import('@/lib/payload/getPayload')
    await getPayload()
  } catch (error) {
    console.error('Payload could not initialise at boot; job crons will start on first use.', error)
  }
}
