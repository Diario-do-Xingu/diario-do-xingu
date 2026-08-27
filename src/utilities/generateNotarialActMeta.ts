import type { Metadata } from 'next'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import type { Media } from '@/payload-types'
import { getServerSideURL } from './getURL'
import { mergeOpenGraph } from './mergeOpenGraph'

export async function generateNotarialActMeta(): Promise<Metadata> {
  const payload = await getPayload()

  const siteMetadata = await payload.findGlobal({
    slug: COLLECTION_SLUGS.SiteMetadata,
  })

  const cardShareImage = siteMetadata.cardShareImage
  let shareImage = cardShareImage as Media

  if (typeof cardShareImage === 'number') {
    shareImage = await payload.findByID({
      collection: 'media',
      id: cardShareImage,
    })
  }

  const title = `Publicações Legais`
  const description = `Publicações Legais - ${siteMetadata.siteDescription}`

  return {
    metadataBase: new URL(getServerSideURL()),
    title: title,
    description: description,
    openGraph: mergeOpenGraph({
      description: description,
      title: `${siteMetadata.siteName} - Publicações Legais`,
      url: `${getServerSideURL()}/${COLLECTION_URL_PATHS.NotarialActs}`,
      images: [
        {
          url: `${getServerSideURL()}/media/${shareImage.filename}`,
          secureUrl: `${getServerSideURL()}/media/${shareImage.filename}`,
          alt: title,
        },
      ],
    }),
    twitter: {
      card: 'summary_large_image',
      title: `${siteMetadata.siteName} - Publicações Legais`,
      description: description,
      images: [
        {
          url: `${getServerSideURL()}/media/${shareImage.filename}`,
          secureUrl: `${getServerSideURL()}/media/${shareImage.filename}`,
          alt: title,
        },
      ],
    },
  }
}
