import { ARCHIVE_LIMIT, COLLECTION_SLUGS } from '@/constants'
import { PageComponent } from './PageComponent'
import { getPayload } from '@/lib/payload/getPayload'

export const revalidate = 600

export default async function Page() {
  const payload = await getPayload()

  const notarialActs = await payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    limit: ARCHIVE_LIMIT.NotarialActs,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return <PageComponent notarialActs={notarialActs} />
}
