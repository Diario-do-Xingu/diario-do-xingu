import React from 'react'

import { ARCHIVE_LIMIT, COLLECTION_SLUGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { PageComponent } from './PageComponent'

export default async function NewsList() {
  const payload = await getPayload()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: ARCHIVE_LIMIT.News,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      heading: true,
      subheading: true,
      publishedAt: true,
      category: true,
      heroImage: true,
      slug: true,
    },
  })

  return <PageComponent news={news} />
}
