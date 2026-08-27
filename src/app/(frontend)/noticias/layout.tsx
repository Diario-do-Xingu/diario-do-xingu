import type { Metadata } from 'next'
import type React from 'react'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import type { Media, SiteMetadatum } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return children
}

export async function generateMetadata(): Promise<Metadata> {
  const siteMetadata = (await getCachedGlobal(COLLECTION_SLUGS.SiteMetadata, 2)()) as SiteMetadatum

  const shareImage = siteMetadata.cardShareImage as Media | undefined
  const images: { url: string; secureUrl: string; alt?: string }[] = []

  if (shareImage) {
    images.push({
      url: shareImage.url || `${getServerSideURL()}/media/${shareImage.filename}`,
      secureUrl: shareImage.url || `${getServerSideURL()}/media/${shareImage.filename}`,
      alt: shareImage.alt || undefined,
    })
  }

  const title = 'Notícias'
  const description = `${title} - ${siteMetadata.siteDescription || 'Jornal Diário do Xingu'}`

  return {
    description,
    title,
    openGraph: mergeOpenGraph({
      description,
      title,
      url: `${getServerSideURL()}/${COLLECTION_URL_PATHS.News}`,
      images,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}
