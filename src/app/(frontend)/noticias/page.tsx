import React from 'react'

import { ARCHIVE_LIMIT, COLLECTION_SLUGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { PageComponent } from './PageComponent'

export const revalidate = 600

export default async function NewsList() {
  const payload = await getPayload()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: ARCHIVE_LIMIT.News,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return <PageComponent news={news} />
}
