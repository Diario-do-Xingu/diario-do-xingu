import type { BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'
import { News } from '@/payload-types'
import { COLLECTION_URL_PATHS } from '@/constants'

export const revalidateNews: CollectionAfterChangeHook<News> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/${COLLECTION_URL_PATHS.News}/${doc.slug}`

      await revalidatePaths(payload)

      payload.logger.info(`Revalidating news at path: ${path}`)
      revalidatePath(path)
      // revalidateTag('news-sitemap')
    }

    // If the news was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${COLLECTION_URL_PATHS.News}/${previousDoc.slug}`

      await revalidatePaths(payload)

      payload.logger.info(`Revalidating old news at path: ${oldPath}`)
      revalidatePath(oldPath)
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

    await revalidatePaths(payload)

    payload.logger.info(`Revalidating deleted news at path: ${path}`)
    revalidatePath(path)
    // revalidateTag('news-sitemap')
  }

  return doc
}

async function revalidatePaths(payload: BasePayload) {
  const rootPath = `/${COLLECTION_URL_PATHS.News}`
  const firstPage = `${rootPath}/page/1`
  const paths = ['/', rootPath, firstPage]

  for (const path of paths) {
    payload.logger.info(`Revalidating path: ${path}`)
    revalidatePath(path)
  }
}
