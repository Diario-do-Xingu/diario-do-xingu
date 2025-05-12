import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { COLLECTION_SLUGS, ARCHIVE_LIMIT } from '@/constants'
import { notFound } from 'next/navigation'
import { PageComponent } from '../../PageComponent'
import { z } from 'zod'

export const revalidate = 600

const searchParamsSchema = z.object({
  date: z.string().optional(),
  key: z.string().optional(),
})

type Args = {
  params: Promise<{
    pageNumber: string
  }>
  searchParams: Promise<z.infer<typeof searchParamsSchema>>
}

function getDates(currentDate: string) {
  const date = currentDate.split('T')[0]

  return {
    greater_than_equal: `${date}T00:00:00.000Z`,
    less_than: `${date}T23:59:59.999Z`,
  }
}

export default async function Page({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const payload = await getPayload({ config: configPromise })
  const { pageNumber } = await paramsPromise

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const parsedSearchParams = searchParamsSchema.safeParse(await searchParamsPromise)
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  let where: {} | undefined = {}

  if (parsedSearchParams.success) {
    const { date, key } = parsedSearchParams.data

    where = {
      and: [
        date
          ? {
              publishedAt: {
                ...getDates(date),
                // greater_than_equal: `${date.split('T')[0]}T00:00:00.000Z`,
                // less_than: `${date.split('T')[0]}T23:59:59.999Z`,
              },
            }
          : {},
        key
          ? {
              key: {
                equals: key,
              },
            }
          : {},
      ],
    }
  }

  const notarialActs = await payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    limit: ARCHIVE_LIMIT.NotarialActs,
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: '-publishedAt',
    where,
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
