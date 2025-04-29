import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { NOTARIAL_ACTS_ARCHIVE_LIMIT, SLUGS, WEBSITE_TITLE } from '@/constants'
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

  const notarialActs = await payload.find({
    collection: SLUGS.NotarialActs,
    depth: 1,
    limit: NOTARIAL_ACTS_ARCHIVE_LIMIT,
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return <PageComponent notarialActs={notarialActs} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise

  return {
    title: `Publicações Legais Página ${pageNumber} - ${WEBSITE_TITLE}`,
  }
}
