import { revalidateTag } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'
import { COLLECTION_SLUGS } from '@/constants'

const tag = `global_${COLLECTION_SLUGS.SiteInfo}`

export const revalidateSiteInfo: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating ${tag}`)
    // Immediate expiry, as before Next 16; see revalidateTagSafely in src/payload/hooks/revalidate.ts
    revalidateTag(tag, { expire: 0 })
  }

  return doc
}
