import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { Fragment } from 'react'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS, SIDEBAR_TAGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { formatDateWithTime } from '@/utilities/formatDate'
import { ImageMedia } from '../Media/ImageMedia'
import { Card, CardContent, CardHeader } from '../ui/card'

const RELATED_COUNT = 4

/**
 * The latest articles in a category, cached per category rather than per article.
 *
 * Excluding the current article in the query made every one of ~2000 article pages its own
 * uncacheable read - and on Atlas each of these populates costs 30-100ms, which is what Sentry's
 * N+1 detector kept flagging. Fetching one extra and dropping the current article in memory turns
 * that into one entry per category, shared by every article in it.
 */
const loadCategoryArticles = (categoryId: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload()
      const { docs } = await payload.find({
        collection: COLLECTION_SLUGS.News,
        draft: false,
        overrideAccess: false,
        // one spare, so removing the current article still leaves a full row
        limit: RELATED_COUNT + 1,
        depth: 1,
        sort: '-publishedAt',
        where: { category: { equals: categoryId } },
      })
      return docs
    },
    ['related-articles', categoryId],
    { tags: [SIDEBAR_TAGS.News], revalidate: 600 },
  )()

export async function ArticleRelatedSection(props: {
  categoryId: string
  currentArticleSlug: string
}) {
  const { categoryId, currentArticleSlug } = props

  const inCategory = await loadCategoryArticles(categoryId)
  const docs = inCategory.filter(({ slug }) => slug !== currentArticleSlug).slice(0, RELATED_COUNT)

  if (docs.length === 0) return null

  return (
    <Card className="mt-10">
      <CardHeader className="border-b-2 py-4">
        <h3 className="font-bold font-globo text-md text-primary">Artigos Relacionados</h3>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-7 pt-5 lg:grid-cols-4">
        {docs.map((item) => {
          // ArticleMedia has no alt field of its own; the caption is the only text available.
          const imageAlt = item.heroImage.description || ''

          return (
            <Fragment key={item.slug!}>
              <Link
                href={`/${COLLECTION_URL_PATHS.News}/${item.slug}`}
                className="flex flex-col gap-4 transition-transform hover:scale-[102%]"
              >
                <ImageMedia
                  alt={imageAlt}
                  resource={item.heroImage.image}
                  imgClassName="aspect-3/2 rounded-default object-cover"
                  variant="card"
                  sizes="(min-width: 1024px) 180px, 100vw"
                />

                <div className="font-bold text-red-700">{item.heading}</div>
                <div className="mt-auto font-medium text-sm text-zinc-500">
                  {formatDateWithTime(item.publishedAt || '', ' -')}
                </div>
              </Link>
            </Fragment>
          )
        })}
      </CardContent>
    </Card>
  )
}
