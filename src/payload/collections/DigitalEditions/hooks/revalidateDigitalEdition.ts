import { revalidatePath } from 'next/cache'
import type { BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS, PAGINATED_LIMIT } from '@/constants'
import type { DigitalEdition } from '@/payload-types'

export const revalidateDigitalEditions: CollectionAfterChangeHook<DigitalEdition> = async ({
  doc,

  operation,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (operation === 'create' || operation === 'update') {
      await revalidatePaths(payload)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<DigitalEdition> = async ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    await revalidatePaths(payload)
  }

  return doc
}

async function revalidatePaths(payload: BasePayload) {
  const { totalDocs } = await payload.count({
    collection: COLLECTION_SLUGS.DigitalEditions,
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / PAGINATED_LIMIT.DigitalEditions)

  const pagePaths = Array.from(
    { length: totalPages },
    (_, i) => `/${COLLECTION_URL_PATHS.DigitalEditions}/page/${i + 1}`,
  )

  const rootPath = `/${COLLECTION_URL_PATHS.DigitalEditions}`
  const paths = ['/', rootPath, ...pagePaths]

  for (const path of paths) {
    payload.logger.info(`Revalidating path: ${path}`)
    revalidatePath(path)
  }
}
