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
        <h4 className="font-bold font-globo text-md text-primary">Artigos Relacionados</h4>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-7 pt-5 lg:grid-cols-4">
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
