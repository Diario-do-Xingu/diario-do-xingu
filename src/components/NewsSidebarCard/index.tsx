import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import type { Where } from 'payload'
import { Fragment } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS, SIDEBAR_TAGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { imageVariant } from '@/utilities/imageVariant'

type NewsSidebarCardProps = {
  title: string
  limit: number
  /** A `payload.find` sort expression, e.g. `-publishedAt`. */
  sort: string
  where?: Where
}

/**
 * The same handful of articles on every page, so the read is cached per configuration rather
 * than repeated for each of the ~2000 articles as they re-prerender on their own windows.
 * The News hooks bust `sidebar-news`, so a publish is still visible at once.
 */
const loadArticles = ({ limit, sort, where }: Omit<NewsSidebarCardProps, 'title'>) =>
  unstable_cache(
    async () => {
      const payload = await getPayload()
      const { docs } = await payload.find({
        collection: COLLECTION_SLUGS.News,
        draft: false,
        overrideAccess: false,
        pagination: false,
        limit,
        sort,
        where,
      })
      return docs
    },
    ['news-sidebar', sort, `${limit}`, JSON.stringify(where ?? {})],
    { tags: [SIDEBAR_TAGS.News], revalidate: 600 },
  )()

/** A titled list of article links for the sidebar; the query decides which articles. */
export async function NewsSidebarCard({ title, limit, sort, where }: NewsSidebarCardProps) {
  const docs = await loadArticles({ limit, sort, where })

  return (
    <Card className="shadow-none">
      <CardHeader className="border-b-2 py-4">
        <h3 className="font-bold font-globo text-md text-red-700">{title}</h3>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {docs.map((item, i) => {
          const { image, description } = item.heroImage
          // An unpopulated image (a bare ID) leaves the card without a thumbnail
          const thumb = typeof image === 'object' ? imageVariant(image, 'card') : undefined

          return (
            <Fragment key={item.slug!}>
              <Link
                href={`/${COLLECTION_URL_PATHS.News}/${item.slug}`}
                className="flex items-center gap-5 transition-transform hover:scale-[102%]"
              >
                <div className="font-bold text-red-700">{item.heading}</div>

                {thumb && (
                  <Image
                    alt={description || ''}
                    className="aspect-square size-28 rounded-default object-cover"
                    height={thumb.height}
                    src={thumb.src}
                    width={thumb.width}
                    sizes="112px"
                  />
                )}
              </Link>

              {i < docs.length - 1 && <div className="divider h-px bg-zinc-300"></div>}
            </Fragment>
          )
        })}
      </CardContent>
    </Card>
  )
}
