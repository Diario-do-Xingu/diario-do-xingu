import React from 'react'

import { COLLECTION_SLUGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { PageComponent } from './PageComponent'

export default async function Page() {
  const payload = await getPayload()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: 16,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return <PageComponent news={news} />
}
