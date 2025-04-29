import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NOTARIAL_ACTS_ARCHIVE_LIMIT, COLLECTION_SLUGS } from '@/constants'
import { notFound } from 'next/navigation'
import { PageComponent } from './PageComponent'
import { generateNotarialActsPageMeta } from '@/utilities/generateNotarialActsPageMeta'

export const metadata = generateNotarialActsPageMeta()

export type Args = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: Args) {
  const payload = await getPayload({ config: configPromise })
  const page = Number((await searchParams).page ?? 1)

  if (isNaN(page)) return notFound()

  const notarialActs = await payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    depth: 1,
    limit: NOTARIAL_ACTS_ARCHIVE_LIMIT,
    page: page,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return <PageComponent notarialActs={notarialActs} />
}
