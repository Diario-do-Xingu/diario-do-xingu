import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getServerSideURL } from './getURL'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getCachedGlobal } from './getGlobals'
import { getShareImageUrl } from './getShareImage'
import { SiteMetadatum } from '@/payload-types'
import { Metadata } from 'next'

const siteMetadata = (await getCachedGlobal(COLLECTION_SLUGS.SiteMetadata)()) as SiteMetadatum
const cardShareImage = await getShareImageUrl()

export function generateNotarialActsPageMeta(): Metadata {
  return {
    metadataBase: new URL(getServerSideURL()),
    title: `Publicações Legais`,
    description: siteMetadata.siteDescription,
    openGraph: mergeOpenGraph({
      url: `${getServerSideURL()}/${COLLECTION_URL_PATHS.NotarialActs}`,
      images: [
        {
          url: `${getServerSideURL()}/media/${cardShareImage.filename}`,
          secureUrl: `${getServerSideURL()}/media/${cardShareImage.filename}`,
          alt: `Publicações Legais`,
        },
      ],
    }),
    twitter: {
      card: 'summary_large_image',
      title: `Publicações Legais`,
      description: siteMetadata.siteDescription,
      images: [
        {
          url: `${getServerSideURL()}/media/${cardShareImage.filename}`,
          secureUrl: `${getServerSideURL()}/media/${cardShareImage.filename}`,
          alt: `Publicações Legais`,
        },
      ],
    },
  }
}
