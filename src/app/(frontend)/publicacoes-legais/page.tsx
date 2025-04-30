import { ARCHIVE_LIMIT, COLLECTION_SLUGS } from '@/constants'
import { notFound } from 'next/navigation'
import { PageComponent } from './PageComponent'
import { Metadata } from 'next'
import { getPayload } from '@/lib/payload/getPayload'
import { generateNotarialActMeta } from '@/utilities/generateNotarialActMeta'

export type Args = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: Args) {
  const payload = await getPayload()
  const page = Number((await searchParams).page ?? 1)

  if (isNaN(page)) return notFound()

  const notarialActs = await payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    limit: ARCHIVE_LIMIT.NotarialActs,
    page: page,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return <PageComponent notarialActs={notarialActs} />
}

export async function generateMetadata(): Promise<Metadata> {
  return await generateNotarialActMeta()
}
