import { timingSafeEqual } from 'node:crypto'
import { revalidatePath, revalidateTag } from 'next/cache'
import { env } from '@/env'

/**
 * Revalidation the job queue can reach.
 *
 * Payload's in-process `autoRun` executes outside a request, where `revalidatePath` throws, so a
 * scheduled publish reaches the database but leaves every cached page as it was until its own
 * window expires. `revalidate.ts` falls back to posting here, which runs inside a request scope
 * and can do what the hook could not.
 *
 * Guarded by CRON_SECRET, the same secret that already authorises running the queue itself.
 */
export async function POST(request: Request) {
  if (!isAuthorised(request)) return new Response('Unauthorized', { status: 401 })

  const { paths, tags } = (await request.json().catch(() => ({}))) as {
    paths?: unknown
    tags?: unknown
  }

  const revalidatedPaths = asStrings(paths)
  const revalidatedTags = asStrings(tags)

  for (const path of revalidatedPaths) revalidatePath(path)
  // `{ expire: 0 }` matches revalidateTagSafely: expire at once rather than serve one more stale
  // response, which is not what an editor expects after a publish.
  for (const tag of revalidatedTags) revalidateTag(tag, { expire: 0 })

  return Response.json({ paths: revalidatedPaths.length, tags: revalidatedTags.length })
}

const asStrings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const isAuthorised = (request: Request) => {
  const given = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${env.CRON_SECRET}`)
  return given.length === expected.length && timingSafeEqual(given, expected)
}
