import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { COLLECTION_SLUGS } from '@/constants'

const tag = `global_${COLLECTION_SLUGS.SiteInfo}`

export const revalidateSiteInfo: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating ${tag}`)
    revalidateTag(tag)
  }

  return doc
}
