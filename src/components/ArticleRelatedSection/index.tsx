import { getPayload } from '@/lib/payload/getPayload'
import { Card, CardContent, CardHeader } from '../ui/card'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { Fragment } from 'react'
import Link from 'next/link'
import { ImageMedia } from '../Media/ImageMedia'
import { formatDateWithTime } from '@/utilities/formatDate'

export async function ArticleRelatedSection(props: {
  categoryId: string
  currentArticleSlug: string
}) {
  const { categoryId, currentArticleSlug } = props

  const payload = await getPayload()

  const relatedArticles = await payload.find({
    collection: COLLECTION_SLUGS.News,
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
        <h4 className="text-md font-globo font-bold text-primary">Artigos Relacionados</h4>
      </CardHeader>

      <CardContent className="flex flex-col flex-nowrap gap-7 pt-5 lg:flex-row">
        {docs.map((item) => {
          const imageAlt = item.heroImage.description || item.heroImage.description || ''

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
                />

                <div className="font-bold text-red-700">{item.heading}</div>
                <div className="mt-auto text-sm font-medium text-zinc-500">
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
