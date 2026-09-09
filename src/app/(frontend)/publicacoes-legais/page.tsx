import { z } from 'zod'
import { ARCHIVE_LIMIT, COLLECTION_SLUGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { saoPauloDayRange } from '@/utilities/formatDate'
import { PageComponent } from './PageComponent'

// export const dynamic = 'force-static'
// export const revalidate = 600

// A repeated query param arrives as an array; the first value wins so one bad param does not drop the other filter.
const singleParam = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => (Array.isArray(value) ? value[0] : value))

const searchParamsSchema = z.object({
  date: singleParam,
  key: singleParam,
})

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const payload = await getPayload()

  const parsedSearchParams = searchParamsSchema.safeParse(await searchParams)

  // biome-ignore lint/complexity/noBannedTypes: Payload's `where` clause is built incrementally; `{}` is the empty-filter shape.
  let where: {} | undefined = {}

  if (parsedSearchParams.success) {
    const { date, key } = parsedSearchParams.data
    // The day the reader picks is a São Paulo day; an unparseable date simply does not filter.
    const range = date ? saoPauloDayRange(date) : undefined

    where = {
      and: [
        range
          ? {
              publishedAt: range,
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
