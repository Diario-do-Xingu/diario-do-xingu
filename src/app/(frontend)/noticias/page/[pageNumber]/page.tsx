import { notFound } from 'next/navigation'
import { PageComponent } from '@/app/(frontend)/noticias/PageComponent'
import { COLLECTION_SLUGS, PAGINATED_LIMIT } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const payload = await getPayload()
  const { pageNumber } = await paramsPromise

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: PAGINATED_LIMIT.News,
    overrideAccess: false,
    page: sanitizedPageNumber,
    sort: '-publishedAt',
  })

  return <PageComponent news={news} />
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const { totalDocs } = await payload.count({
    collection: COLLECTION_SLUGS.News,
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / PAGINATED_LIMIT.News)

  const pages: { pageNumber: string }[] = []

  // Page 1 redirects to the list root (next.config.mjs).
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
