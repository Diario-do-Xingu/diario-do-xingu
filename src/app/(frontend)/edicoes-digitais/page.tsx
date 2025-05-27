import { COLLECTION_SLUGS, PAGINATED_LIMIT } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'

import { DigitalEditionsPageComponent } from './PageComponent'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function DigitalEditionsPage() {
  const payload = await getPayload()

  const digitalEditions = await payload.find({
    collection: COLLECTION_SLUGS.DigitalEditions,
    limit: PAGINATED_LIMIT.DigitalEditions,
    overrideAccess: false,
    sort: '-createdAt',
  })

  return <DigitalEditionsPageComponent digitalEditions={digitalEditions} />
}
