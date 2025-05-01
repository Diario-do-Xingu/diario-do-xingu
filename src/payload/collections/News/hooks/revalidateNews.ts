import type { BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'
import { News } from '@/payload-types'
import { ARCHIVE_LIMIT, COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'

export const revalidateNews: CollectionAfterChangeHook<News> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/${COLLECTION_URL_PATHS.News}/${doc.slug}`

      payload.logger.info(`Revalidating news at path: ${path}`)

      revalidatePath(path)
      await revalidatePaths(payload)
      // revalidateTag('news-sitemap')
    }

    // If the news was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${COLLECTION_URL_PATHS.News}/${previousDoc.slug}`

      payload.logger.info(`Revalidating old news at path: ${oldPath}`)

      revalidatePath(oldPath)
      await revalidatePaths(payload)
      // revalidateTag('news-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<News> = async ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    const path = `/${COLLECTION_URL_PATHS.News}/${doc?.slug}`

    payload.logger.info(`Revalidating deleted news at path: ${path}`)

    revalidatePath(path)
    await revalidatePaths(payload)
    // revalidateTag('news-sitemap')
  }

  return doc
}

async function revalidatePaths(payload: BasePayload) {
  const { totalDocs } = await payload.count({
    collection: COLLECTION_SLUGS.News,
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / ARCHIVE_LIMIT.News)

  const rootPath = `/${COLLECTION_URL_PATHS.News}`
  revalidatePath(rootPath)
  payload.logger.info(`Revalidating path: ${rootPath}`)

  for (let i = 1; i <= totalPages; i++) {
    const path = `/${COLLECTION_URL_PATHS.News}/page/${i}`
    payload.logger.info(`Revalidating path: ${path}`)
    revalidatePath(path)
  }
}
