import type { BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'
import { NotarialAct } from '@/payload-types'
import { COLLECTION_URL_PATHS } from '@/constants'

export const revalidateNotarialActs: CollectionAfterChangeHook<NotarialAct> = async ({
  doc,
  req: { payload, context },
  previousDoc,
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/${COLLECTION_URL_PATHS.NotarialActs}/${doc.slug}`

      await revalidatePaths(payload)

      payload.logger.info(`Revalidating notarial act at path: ${path}`)
      revalidatePath(path)
      // revalidateTag(`${COLLECTION_URL_PATHS.NotarialActs}-sitemap`)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${COLLECTION_URL_PATHS.NotarialActs}/${previousDoc.slug}`

      await revalidatePaths(payload)

      payload.logger.info(`Revalidating old notarial act at path: ${oldPath}`)
      revalidatePath(oldPath)
      // revalidateTag(`${COLLECTION_URL_PATHS.NotarialActs}-sitemap`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<NotarialAct> = async ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    const path = `/${COLLECTION_URL_PATHS.NotarialActs}/${doc?.slug}`

    await revalidatePaths(payload)

    payload.logger.info(`Revalidating deleted notarial act at path: ${path}`)
    revalidatePath(path)
    // revalidateTag(`${COLLECTION_URL_PATHS.NotarialActs}-sitemap`)
  }
  return doc
}

async function revalidatePaths(payload: BasePayload) {
  const rootPath = `/${COLLECTION_URL_PATHS.NotarialActs}`
  const firstPage = `${rootPath}/page/1`
  const paths = ['/', rootPath, firstPage]

  for (const path of paths) {
    payload.logger.info(`Revalidating path: ${path}`)
    revalidatePath(path)
  }
}
