import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'

const tag = `global_${COLLECTION_SLUGS.Advertisement}`

const paths = ['/', `/${COLLECTION_URL_PATHS.News}`, `/${COLLECTION_URL_PATHS.NotarialActs}`]

export const revalidateAdvertisement: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating ${tag}`)
    revalidateTag(`global_${tag}`)

    for (const path of paths) {
      console.log(path)
      revalidatePath(path)
    }
  }

  return doc
}
