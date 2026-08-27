import { COLLECTION_SLUGS, PAGINATED_LIMIT } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { PageComponent } from './PageComponent'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: PAGINATED_LIMIT.News,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return <PageComponent news={news} />
}
