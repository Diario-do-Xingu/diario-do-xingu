import { revalidatePath, revalidateTag } from 'next/cache'
import type { BasePayload } from 'payload'

/**
 * Wrappers for Next's revalidation that also work outside a request.
 *
 * Collection hooks fire from admin/REST requests, where revalidation works, and from the job
 * queue's in-process cron for scheduled publishes, where there is no request and Next throws
 * "static generation store missing". In that case the work is posted to `/api/revalidate`,
 * which runs inside a request and can do it properly - otherwise a scheduled publish would sit
 * invisible until each page's own window expired, up to ten minutes later.
 */
export function revalidatePathSafely(payload: BasePayload, path: string) {
  attempt(payload, `path ${path}`, () => revalidatePath(path), { path })
}

/**
 * `{ expire: 0 }` keeps the pre-Next 16 semantics (the tag expires at once and the next request
 * regenerates before responding). The documented `'max'` profile would serve one more stale
 * response and refresh in the background, which is not what an editor saving a fix expects.
 */
export function revalidateTagSafely(payload: BasePayload, tag: string) {
  attempt(payload, `tag ${tag}`, () => revalidateTag(tag, { expire: 0 }), { tag })
}

function attempt(
  payload: BasePayload,
  what: string,
  revalidate: () => void,
  deferred: { path?: string; tag?: string },
) {
  try {
    revalidate()
    payload.logger.info(`Queued revalidation of ${what}`)
  } catch (error) {
    if (!isOutsideRequest(error)) throw error
    defer(payload, deferred)
  }
}

const isOutsideRequest = (error: unknown) =>
  error instanceof Error && error.message.includes('static generation store missing')

/**
 * One publish skips six revalidations, so they are collected and sent as a single request on
 * the next tick rather than six round trips.
 */
const pending = { paths: new Set<string>(), tags: new Set<string>() }
let flushing: NodeJS.Immediate | undefined

function defer(payload: BasePayload, { path, tag }: { path?: string; tag?: string }) {
  if (path) pending.paths.add(path)
  if (tag) pending.tags.add(tag)
  if (flushing) return

  flushing = setImmediate(() => {
    flushing = undefined
    const paths = [...pending.paths]
    const tags = [...pending.tags]
    pending.paths.clear()
    pending.tags.clear()

    void flush(payload, paths, tags)
  })
}

async function flush(payload: BasePayload, paths: string[], tags: string[]) {
  const what = `${paths.length} path(s) and ${tags.length} tag(s)`

  try {
    // Imported here rather than at module scope: `env` validates on import, and this module is
    // pulled into unit tests that have no environment and never reach this path.
    const { env } = await import('@/env')

    const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${env.CRON_SECRET}` },
      body: JSON.stringify({ paths, tags }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) throw new Error(`responded ${response.status}`)
    payload.logger.info(`Revalidated ${what} out of band (job cron)`)
  } catch (error) {
    // Pages still heal on their own windows, so this is a delay rather than a failure - but a
    // silent one: a scheduled article goes back to being invisible for up to ten minutes, and
    // a log line in the platform console is where the original bug hid for months.
    payload.logger.warn(
      `Could not revalidate ${what} out of band: ${error instanceof Error ? error.message : error}`,
    )

    const { captureMessage } = await import('@sentry/nextjs')
    captureMessage('Out-of-band revalidation failed', {
      level: 'warning',
      tags: { phase: 'revalidate', trigger: 'job-cron' },
      extra: {
        paths,
        tags,
        cause: error instanceof Error ? error.message : String(error),
      },
    })
  }
}
