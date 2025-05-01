import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { COLLECTION_SLUGS } from '@/constants'

export const revalidateMetadata: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    const tag = `global_${COLLECTION_SLUGS.SiteInfo}`
    payload.logger.info(`Revalidating ${tag}`)
    revalidateTag(tag)
  }

  return doc
}
