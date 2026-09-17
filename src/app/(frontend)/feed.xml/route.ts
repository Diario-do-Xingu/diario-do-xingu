import { unstable_cache } from 'next/cache'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS, FEED_LIMIT, FEED_TAG } from '@/constants'
import { env } from '@/env'
import { getPayload } from '@/lib/payload/getPayload'
import { getSiteMeta } from '@/utilities/getSiteMeta'
import { buildRssFeed } from '@/utilities/rssFeed'

// Same window as the list routes: the News hooks bust FEED_TAG on publish, unpublish and
// delete, and this window covers scheduled publishes, which run outside a request where
// revalidation is unavailable.
export const revalidate = 600

const getFeedArticles = unstable_cache(
  async () => {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: COLLECTION_SLUGS.News,
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: FEED_LIMIT,
      sort: '-publishedAt',
      select: { slug: true, heading: true, subheading: true, highligh: true, publishedAt: true },
    })
    return docs
  },
  [FEED_TAG],
  { tags: [FEED_TAG], revalidate },
)

export async function GET() {
  const [{ siteTitle, siteDescription }, docs] = await Promise.all([
    getSiteMeta(),
    getFeedArticles(),
  ])

  const body = buildRssFeed({
    title: siteTitle,
    description: siteDescription,
    siteUrl: env.NEXT_PUBLIC_SERVER_URL,
    feedUrl: `${env.NEXT_PUBLIC_SERVER_URL}/feed.xml`,
    items: docs.map(({ heading, subheading, highligh, slug, publishedAt }) => ({
      title: heading,
      link: `${env.NEXT_PUBLIC_SERVER_URL}/${COLLECTION_URL_PATHS.News}/${slug}`,
      description: subheading || highligh,
      publishedAt,
    })),
  })

  return new Response(body, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  })
}
