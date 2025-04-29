import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { COLLECTION_SLUGS } from '@/constants'

export const revalidateMetadata: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating global_${COLLECTION_SLUGS.SiteMetadata}`)
    revalidateTag(`global_${COLLECTION_SLUGS.SiteMetadata}`)
  }

  return doc
}
