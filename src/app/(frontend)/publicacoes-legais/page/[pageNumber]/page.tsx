import { notFound } from 'next/navigation'
import { COLLECTION_SLUGS, PAGINATED_LIMIT } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { findNotarialActs } from '../../findNotarialActs'
import { PageComponent } from '../../PageComponent'

// Unfiltered archive only; filtered pages render on the dynamic root route (`?page=N`).
export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const notarialActs = await findNotarialActs({}, sanitizedPageNumber)

  return <PageComponent notarialActs={notarialActs} />
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const { totalDocs } = await payload.count({
    collection: COLLECTION_SLUGS.NotarialActs,
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / PAGINATED_LIMIT.NotarialActs)

  const pages: { pageNumber: string }[] = []

  // Page 1 redirects to the list root (next.config.mjs).
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
