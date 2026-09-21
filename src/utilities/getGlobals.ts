import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getPayload } from '@/lib/payload/getPayload'
import type { Config } from '@/payload-types'

type GlobalSlug = keyof Config['globals']

/**
 * Reads a global through `unstable_cache`, tagged `global_<slug>` for revalidation. The result
 * is typed by the slug. `depth` is part of the cache key: a shallower read returns
 * relationships as bare IDs and must not share an entry with a deeper one.
 *
 * Wrapped in React `cache` so one render shares one read: metadata, Header and Footer all
 * read SiteInfo, and `unstable_cache` dedupes hits but not concurrent misses, so a cold cache
 * (every deploy, every SiteInfo edit) otherwise sends the same query three times.
 */
export const getCachedGlobal = cache(
  <TSlug extends GlobalSlug>(slug: TSlug, depth = 0): Promise<Config['globals'][TSlug]> =>
    unstable_cache(
      async () => {
        const payload = await getPayload()
        return payload.findGlobal({ slug, depth })
      },
      [slug, `depth:${depth}`],
      { tags: [`global_${slug}`] },
    )(),
)
