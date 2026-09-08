'use server'

import type { MongooseAdapter } from '@payloadcms/db-mongodb'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { env } from '@/env'
import { getPayload } from '@/lib/payload/getPayload'

const articleIdSchema = z.string().regex(/^[a-f\d]{24}$/i)

// One count per article per browser per day. The cookie only holds validated ids, capped so
// it cannot grow past what browsers accept.
const READ_COOKIE = 'read_articles'
const READ_COOKIE_MAX_IDS = 50
const READ_COOKIE_MAX_AGE = 60 * 60 * 24

// `$inc` throws on an explicit null, so add through $ifNull instead.
const incrementReadCount = (path: string) => [
  { $set: { [path]: { $add: [{ $ifNull: [`$${path}`, 0] }, 1] } } },
]

/**
 * Public server action fired by <CountRead /> after five seconds on an article.
 * Increments `readCount` with atomic updates through the Mongo adapter instead of
 * `payload.update`, which would write a new version per hit (evicting real editorial
 * history at maxPerDoc 10) and lose updates under load.
 *
 * The live document and the latest version are both incremented: editorial saves merge
 * incoming fields over the latest version, so a count that only lived on the document
 * would be reset by the next save. The two writes are not one transaction, so an
 * editorial save that lands between them can be off by one; that is accepted.
 *
 * Never throws to the client; anything unexpected is logged and swallowed.
 */
export async function countReadAction(args: { articleId: string }) {
  const parsed = articleIdSchema.safeParse(args.articleId)
  if (!parsed.success) return
  const articleId = parsed.data

  const payload = await getPayload()

  if (!env.NEXT_PUBLIC_IS_LIVE) {
    payload.logger.info('Skip increase article read view for dev')
    return
  }

  const cookieStore = await cookies()
  const alreadyRead = (cookieStore.get(READ_COOKIE)?.value.split(',') ?? []).filter(
    (id) => articleIdSchema.safeParse(id).success,
  )
  if (alreadyRead.includes(articleId)) return

  try {
    const { collections, versions } = payload.db as MongooseAdapter

    const result = await collections.news.updateOne(
      { _id: articleId, _status: 'published' },
      incrementReadCount('readCount'),
      // Mongoose would otherwise $set updatedAt on this query; a read is not an edit.
      { timestamps: false },
    )

    if (result.modifiedCount === 0) return

    // Mark this browser as counted before the second write, so a failure there cannot
    // leave the count incremented with dedupe switched off.
    cookieStore.set(
      READ_COOKIE,
      [...alreadyRead, articleId].slice(-READ_COOKIE_MAX_IDS).join(','),
      {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: READ_COOKIE_MAX_AGE,
      },
    )

    await versions.news.updateOne(
      { parent: articleId, latest: true },
      incrementReadCount('version.readCount'),
    )

    payload.logger.info(`Increase read counter for ${articleId}`)
  } catch (error) {
    payload.logger.error({ err: error, msg: `Failed to increase read counter for ${articleId}` })
  }
}
