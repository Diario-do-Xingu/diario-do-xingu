import Link from 'next/link'
import { Fragment } from 'react'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { formatDateWithTime } from '@/utilities/formatDate'
import { ImageMedia } from '../Media/ImageMedia'
import { Card, CardContent, CardHeader } from '../ui/card'

export async function ArticleRelatedSection(props: {
  categoryId: string
  currentArticleSlug: string
}) {
  const { categoryId, currentArticleSlug } = props

  const payload = await getPayload()

  const relatedArticles = await payload.find({
    collection: COLLECTION_SLUGS.News,
    draft: false,
    overrideAccess: false,
    limit: 4,
    depth: 1,
    sort: '-publishedAt',
    where: {
      slug: {
        not_equals: currentArticleSlug,
      },
      category: {
        equals: categoryId,
      },
    },
  })

  const { docs, totalDocs } = relatedArticles

  if (totalDocs === 0) return null

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
                  imgClassName="aspect-[3/2] rounded-default object-cover"
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
