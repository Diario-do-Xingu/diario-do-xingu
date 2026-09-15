import { unstable_cache } from 'next/cache'
import { getPayload } from '@/lib/payload/getPayload'
import type { Config } from '@/payload-types'

type GlobalSlug = keyof Config['globals']

/**
 * Returns an `unstable_cache` reader for a global, tagged `global_<slug>` for revalidation.
 * The result is typed by the slug. `depth` is part of the cache key: a shallower read returns
 * relationships as bare IDs and must not share an entry with a deeper one.
 */
export const getCachedGlobal = <TSlug extends GlobalSlug>(slug: TSlug, depth = 0) =>
  unstable_cache(
    async (): Promise<Config['globals'][TSlug]> => {
      const payload = await getPayload()
      return payload.findGlobal({ slug, depth })
    },
    [slug, `depth:${depth}`],
    { tags: [`global_${slug}`] },
  )
