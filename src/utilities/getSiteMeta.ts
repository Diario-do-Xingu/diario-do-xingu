import { COLLECTION_SLUGS } from '@/constants'
import type { Media, SiteMetadatum } from '@/payload-types'
import { getCachedGlobal } from './getGlobals'
import { getServerSideURL } from './getURL'

/**
 * Site-wide metadata from the SiteMetadata global with fallbacks applied, and the
 * card share image already shaped for `openGraph.images` / `twitter.images`.
 * Route-level `generateMetadata` builds on top of this instead of re-reading the global.
 */
export async function getSiteMeta() {
  const siteMetadata = (await getCachedGlobal(COLLECTION_SLUGS.SiteMetadata, 2)()) as SiteMetadatum
  const shareImage = siteMetadata.cardShareImage as Media | undefined

  const images = shareImage
    ? [
        {
          url: shareImage.url || `${getServerSideURL()}/media/${shareImage.filename}`,
          alt: shareImage.alt || undefined,
        },
      ]
    : []

  return {
    siteName: siteMetadata.siteName || 'Diário do Xingu',
    siteTitle: siteMetadata.siteTitle || 'Diário do Xingu - Portal de Notícias',
    siteDescription: siteMetadata.siteDescription || 'Jornal Diário do Xingu',
    images,
  }
}
