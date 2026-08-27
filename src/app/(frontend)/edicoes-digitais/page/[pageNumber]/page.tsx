import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { COLLECTION_SLUGS, PAGINATED_LIMIT } from '@/constants'
import { DigitalEditionsPageComponent } from '../../PageComponent'

export const revalidate = 600

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

  const digitalEditions = await payload.find({
    collection: COLLECTION_SLUGS.DigitalEditions,
    limit: PAGINATED_LIMIT.DigitalEditions,
    overrideAccess: false,
    page: sanitizedPageNumber,
    sort: '-createdAt',
  })

  return <DigitalEditionsPageComponent digitalEditions={digitalEditions} />
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: COLLECTION_SLUGS.DigitalEditions,
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / PAGINATED_LIMIT.DigitalEditions)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
