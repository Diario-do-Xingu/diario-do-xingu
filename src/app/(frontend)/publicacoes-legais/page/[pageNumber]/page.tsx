import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { COLLECTION_SLUGS, ARCHIVE_LIMIT } from '@/constants'
import { notFound } from 'next/navigation'
import { PageComponent } from '../../PageComponent'

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

  const notarialActs = await payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    limit: ARCHIVE_LIMIT.NotarialActs,
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return <PageComponent notarialActs={notarialActs} />
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: COLLECTION_SLUGS.NotarialActs,
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / ARCHIVE_LIMIT.NotarialActs)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
