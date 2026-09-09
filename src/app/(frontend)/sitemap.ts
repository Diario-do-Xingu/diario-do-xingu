import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS, SITEMAP_TAGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { getServerSideURL } from '@/utilities/getURL'

// Same window as the list routes. The collection hooks bust the tags on manual publish,
// unpublish and delete; scheduled publishes run in the job cron, outside a request, where
// revalidation is not available, so the route and its cached queries both expire on this
// window to bring those in.
export const revalidate = 600

const STATIC_PATHS = [
  '',
  `/${COLLECTION_URL_PATHS.News}`,
  `/${COLLECTION_URL_PATHS.NotarialActs}`,
  `/${COLLECTION_URL_PATHS.DigitalEditions}`,
  '/tabela-brasileirao',
]

// One cached query per collection, keyed and tagged by the collection's sitemap tag.
const cachedForSitemap = <T>(tag: string, load: () => Promise<T>) =>
  unstable_cache(load, [tag], { tags: [tag], revalidate })

// Published articles only (anonymous access rules apply), with their last edit.
const getPublishedNews = cachedForSitemap(SITEMAP_TAGS.News, async () => {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: COLLECTION_SLUGS.News,
    overrideAccess: false,
    draft: false,
    pagination: false,
    depth: 0,
    select: { slug: true, updatedAt: true },
  })
  return docs
})

// Notices are addressed by `key`, the same field the detail route and its canonical use.
const getPublishedNotarialActs = cachedForSitemap(SITEMAP_TAGS.NotarialActs, async () => {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    overrideAccess: false,
    draft: false,
    pagination: false,
    depth: 0,
    select: { key: true, updatedAt: true },
  })
  return docs
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const [news, notarialActs] = await Promise.all([getPublishedNews(), getPublishedNotarialActs()])

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${base}${path}` })),
    ...news.map(({ slug, updatedAt }) => ({
      url: `${base}/${COLLECTION_URL_PATHS.News}/${slug}`,
      lastModified: updatedAt,
    })),
    ...notarialActs.flatMap(({ key, updatedAt }) =>
      key
        ? [{ url: `${base}/${COLLECTION_URL_PATHS.NotarialActs}/${key}`, lastModified: updatedAt }]
        : [],
    ),
  ]
}
