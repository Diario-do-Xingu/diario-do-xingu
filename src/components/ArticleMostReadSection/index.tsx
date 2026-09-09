import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { ARCHIVE_LIMIT, COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import type { ArticleMedia } from '@/payload-types'
import { imageVariant } from '@/utilities/imageVariant'
import { Card, CardContent, CardHeader } from '../ui/card'

export async function ArticleMostReadSection() {
  const payload = await getPayload()

  const mostReadNews = await payload.find({
    collection: COLLECTION_SLUGS.News,
    draft: false,
    overrideAccess: false,
    limit: ARCHIVE_LIMIT.MostRead,
    sort: '-readCount',
    pagination: false,
  })

  const { docs } = mostReadNews

  return (
    <Card className="shadow-none">
      <CardHeader className="border-b-2 py-4">
        <h3 className="font-bold font-globo text-md text-red-700">Mais Lidas</h3>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {docs.map((item, i) => {
          const image = item.heroImage.image as ArticleMedia
          const imageAlt = item.heroImage.description || ''
          const thumb = imageVariant(image, 'card')

          return (
            <Fragment key={item.slug!}>
              <Link
                href={`/${COLLECTION_URL_PATHS.News}/${item.slug}`}
                className="flex items-center gap-5 transition-transform hover:scale-[102%]"
              >
                <div className="font-bold text-red-700">{item.heading}</div>

                <Image
                  alt={imageAlt}
                  className="aspect-square size-28 rounded-default object-cover"
                  height={thumb.height}
                  src={thumb.src}
                  width={thumb.width}
                  sizes="112px"
                />
              </Link>

              {i < docs.length - 1 && <div className="divider h-[1px] bg-zinc-300"></div>}
            </Fragment>
          )
        })}
      </CardContent>
    </Card>
  )
}
