import { ARCHIVE_LIMIT, COLLECTION_SLUGS } from '@/constants'
import { PageComponent } from './PageComponent'
import { getPayload } from '@/lib/payload/getPayload'
import { z } from 'zod'

// export const dynamic = 'force-static'
// export const revalidate = 600

const searchParamsSchema = z.object({
  date: z.string().optional(),
  key: z.string().optional(),
})

function getDates(currentDate: string) {
  const date = currentDate.split('T')[0]

  return {
    greater_than_equal: `${date}T00:00:00.000Z`,
    less_than: `${date}T23:59:59.999Z`,
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; key?: string }>
}) {
  const payload = await getPayload()

  const parsedSearchParams = searchParamsSchema.safeParse(await searchParams)

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  let where: {} | undefined = {}

  if (parsedSearchParams.success) {
    const { date, key } = parsedSearchParams.data

    where = {
      and: [
        date
          ? {
              publishedAt: getDates(date),
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
    overrideAccess: false,
    sort: '-publishedAt',
    where: where,
  })

  return <PageComponent notarialActs={notarialActs} />
}
