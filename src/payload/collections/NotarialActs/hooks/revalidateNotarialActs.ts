import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { NotarialAct } from '@/payload-types'
import { COLLECTION_URL_PATHS } from '@/constants'

export const revalidateNotarialActs: CollectionAfterChangeHook<NotarialAct> = ({
  doc,
  req: { payload, context },
  previousDoc,
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/${COLLECTION_URL_PATHS.NotarialActs}/${doc.slug}`
      payload.logger.info(`Revalidating notarial act at path: ${path}`)
      revalidatePath(path)
      revalidateTag(`${COLLECTION_URL_PATHS.NotarialActs}-sitemap`)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${COLLECTION_URL_PATHS.NotarialActs}/${previousDoc.slug}`
      payload.logger.info(`Revalidating old notarial act at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidateTag(`${COLLECTION_URL_PATHS.NotarialActs}-sitemap`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<NotarialAct> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/${COLLECTION_URL_PATHS.NotarialActs}/${doc?.slug}`

    revalidatePath(path)
    revalidateTag(`${COLLECTION_URL_PATHS.NotarialActs}-sitemap`)
  }
  return doc
}
