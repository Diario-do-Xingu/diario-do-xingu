import { unstable_cache } from 'next/cache'
import { getPayload } from '@/lib/payload/getPayload'
import type { Config } from '@/payload-types'

type Global = keyof Config['globals']

export async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload()

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) => {
  return unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
}
