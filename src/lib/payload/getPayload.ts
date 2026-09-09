import { getPayload as getPayloadRoot } from 'payload'
import config from '@/payload.config'

/**
 * `cron: true` starts the job queue's autoRun crons the first time Payload is initialised.
 * src/instrumentation.ts does that at server boot; this is the fallback if boot init failed.
 * Payload starts them only once and skips them during `next build`.
 */
export async function getPayload() {
  return await getPayloadRoot({ config: await config, cron: true })
}
