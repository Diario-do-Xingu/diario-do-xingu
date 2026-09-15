import { revalidatePath, revalidateTag } from 'next/cache'
import type { BasePayload } from 'payload'

/**
 * Wrappers for Next's revalidation that tolerate running outside a request.
 *
 * Collection hooks fire from admin/REST requests, where revalidation works, and from the
 * job queue's in-process cron for scheduled publishes, where there is no request and Next
 * throws "static generation store missing". Pages heal through their time-based
 * `revalidate` windows in that case, so only that error is swallowed (with a warning);
 * anything else is a real bug and is rethrown.
 */
export function revalidatePathSafely(payload: BasePayload, path: string) {
  attempt(payload, `path ${path}`, () => revalidatePath(path))
}

/**
 * `{ expire: 0 }` keeps the pre-Next 16 semantics (the tag expires at once and the next request
 * regenerates before responding). The documented `'max'` profile would serve one more stale
 * response and refresh in the background, which is not what an editor saving a fix expects.
 */
export function revalidateTagSafely(payload: BasePayload, tag: string) {
  attempt(payload, `tag ${tag}`, () => revalidateTag(tag, { expire: 0 }))
}

function attempt(payload: BasePayload, what: string, revalidate: () => void) {
  try {
    revalidate()
    payload.logger.info(`Queued revalidation of ${what}`)
  } catch (error) {
    if (!isOutsideRequest(error)) throw error
    payload.logger.warn(`Skipped revalidation of ${what}: no request scope (job cron)`)
  }
}

const isOutsideRequest = (error: unknown) =>
  error instanceof Error && error.message.includes('static generation store missing')
