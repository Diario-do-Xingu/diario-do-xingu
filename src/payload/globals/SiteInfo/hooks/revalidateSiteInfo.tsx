import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { COLLECTION_SLUGS } from '@/constants'

export const revalidateSiteInfo: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating ${COLLECTION_SLUGS.SiteInfo}`)
    revalidateTag(`global_${COLLECTION_SLUGS.SiteInfo}`)
  }

  return doc
}
