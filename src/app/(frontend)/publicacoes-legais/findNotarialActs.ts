import type { Where } from 'payload'
import { z } from 'zod'
import { COLLECTION_SLUGS, PAGINATED_LIMIT } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { saoPauloDayRange } from '@/utilities/formatDate'

// A repeated query param arrives as an array; the first value wins so one bad param does not drop the other filter.
const singleParam = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => (Array.isArray(value) ? value[0] : value))

/** Query params of the filtered list: `/publicacoes-legais?date=yyyy-MM-dd&key=…&page=N`. */
export const searchParamsSchema = z.object({
  date: singleParam,
  key: singleParam,
  page: singleParam,
})

export type NotarialActsFilter = {
  date?: string
  key?: string
}

/**
 * One page of published acts, newest first. Both list routes go through here so page 1 and
 * page N share the limit and the filter. The day the reader picks is a São Paulo day; an
 * unparseable date simply does not filter.
 */
export async function findNotarialActs({ date, key }: NotarialActsFilter, page = 1) {
  const range = date ? saoPauloDayRange(date) : undefined

  const conditions: Where[] = []
  if (range) conditions.push({ publishedAt: range })
  if (key) conditions.push({ key: { equals: key } })

  const payload = await getPayload()

  return payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    limit: PAGINATED_LIMIT.NotarialActs,
    page,
    overrideAccess: false,
    sort: '-publishedAt',
    where: conditions.length ? { and: conditions } : undefined,
  })
}
