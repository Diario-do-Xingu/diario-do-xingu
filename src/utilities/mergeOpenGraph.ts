import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { COLLECTION_SLUGS, WEBSITE_TITLE } from '@/constants'
import { Media } from '@/payload-types'
import { getPayload } from '@/lib/payload/getPayload'

export const mergeOpenGraph = async (
  og?: Metadata['openGraph'],
): Promise<Metadata['openGraph']> => {
  const payload = await getPayload()

  const siteMetadata = await payload.findGlobal({
    slug: COLLECTION_SLUGS.SiteMetadata,
  })

  const cardShareImage = siteMetadata.cardShareImage
  let shareImage = cardShareImage as Media

  if (typeof cardShareImage === 'number') {
    shareImage = await (
      await getPayload()
    ).findByID({
      collection: 'media',
      id: cardShareImage,
    })
  }

  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: siteMetadata.siteDescription,
    siteName: siteMetadata.siteName,
    title: siteMetadata.siteTitle,
    locale: 'pt_BR',
    url: getServerSideURL(),
  }

  const images = []

  if (shareImage.filename) {
    images.push({
      url: `${getServerSideURL()}/media/${shareImage.filename}`,
      secureUrl: `${getServerSideURL()}/media/${shareImage.filename}`,
      alt: `${WEBSITE_TITLE} - Portal de Notícias`,
    })
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : images,
  }
}
