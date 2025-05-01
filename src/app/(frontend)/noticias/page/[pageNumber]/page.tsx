import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { COLLECTION_SLUGS, ARCHIVE_LIMIT } from '@/constants'
import { notFound } from 'next/navigation'

import { PageComponent } from '../../PageComponent'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const payload = await getPayload({ config: configPromise })
  const { pageNumber } = await paramsPromise

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: ARCHIVE_LIMIT.News,
    overrideAccess: false,
    page: sanitizedPageNumber,
    sort: '-publishedAt',
    select: {
      heading: true,
      subheading: true,
      publishedAt: true,
      category: true,
      heroImage: true,
      slug: true,
    },
  })

  return <PageComponent news={news} />
}
