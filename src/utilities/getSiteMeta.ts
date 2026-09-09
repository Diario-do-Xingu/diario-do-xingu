import { cache } from 'react'
import { COLLECTION_SLUGS } from '@/constants'
import type { Media, SiteInfo, SiteMetadatum } from '@/payload-types'
import { getCachedGlobal } from './getGlobals'
import { getServerSideURL } from './getURL'

/**
 * Site-wide metadata from the SiteMetadata global with fallbacks applied, and the
 * card share image already shaped for `openGraph.images` / `twitter.images`.
 * Route-level `generateMetadata` builds on top of this instead of re-reading the global.
 */
export const getSiteMeta = cache(async () => {
  const [siteMetadata, siteInfo] = (await Promise.all([
    getCachedGlobal(COLLECTION_SLUGS.SiteMetadata, 2)(),
    getCachedGlobal(COLLECTION_SLUGS.SiteInfo, 1)(),
  ])) as [SiteMetadatum, SiteInfo]
  const shareImage = siteMetadata.cardShareImage as Media | undefined
  const logo = typeof siteInfo.logo === 'object' ? siteInfo.logo : undefined

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
    /** Absolute publisher logo for structured data; falls back to the share image. */
    logoUrl: absoluteUrl(logo?.url ?? shareImage?.url),
  }
})

/** Upload URLs are relative on local storage and absolute on Payload Cloud. */
export function absoluteUrl(url?: string | null) {
  if (!url) return undefined
  return url.startsWith('/') ? `${getServerSideURL()}${url}` : url
}
