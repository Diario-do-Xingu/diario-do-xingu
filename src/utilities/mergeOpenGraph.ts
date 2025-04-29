import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { COLLECTION_SLUGS, WEBSITE_TITLE } from '@/constants'
import { getCachedGlobal } from './getGlobals'
import { SiteMetadatum } from '@/payload-types'

import { getShareImageUrl } from './getShareImage'

const metadata = (await getCachedGlobal(COLLECTION_SLUGS.SiteMetadata)()) as SiteMetadatum
const cardShareImage = await getShareImageUrl()

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: metadata.siteDescription,
  siteName: metadata.siteName,
  title: metadata.siteTitle,
  locale: 'pt_BR',
  url: getServerSideURL(),
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  const images = []

  if (cardShareImage.filename) {
    images.push({
      url: `${getServerSideURL()}/media/${cardShareImage.filename}`,
      secureUrl: `${getServerSideURL()}/media/${cardShareImage.filename}`,
      alt: `${WEBSITE_TITLE} - Portal de Notícias`,
    })
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : images,
  }
}
