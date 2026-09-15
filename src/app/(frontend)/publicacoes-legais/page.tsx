import { notFound } from 'next/navigation'
import { findNotarialActs, searchParamsSchema } from './findNotarialActs'
import { PageComponent } from './PageComponent'

// Dynamic because it reads the query (never `force-static`, which empties searchParams): the
// filtered list and its pages (`?page=N`) render here, while the unfiltered archive pages stay
// static under `/page/N`.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { data } = searchParamsSchema.safeParse(await searchParams)
  const filter = { date: data?.date, key: data?.key }

  const pageNumber = Number(data?.page ?? 1)

  if (!Number.isInteger(pageNumber)) notFound()

  const notarialActs = await findNotarialActs(filter, pageNumber)

  return <PageComponent notarialActs={notarialActs} filter={filter} />
}
