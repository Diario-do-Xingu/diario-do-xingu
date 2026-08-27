import type { Metadata } from 'next'
import type React from 'react'
import { Advertisement } from '@/components/Advertisement'
import { Grid, GridRight } from '@/components/Grid'
import { SoccerWidget } from '@/components/SoccerWidget'
import { WeatherWidget } from '@/components/WeatherWidget'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import type { Media, SiteMetadatum } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <Grid className="container-y-padding container gap-y-10">
      {children}

      <GridRight className="space-y-5">
        <WeatherWidget />
        <Advertisement adType="firstSideAdsBanner" />
        <SoccerWidget />
        <Advertisement adType="secondSideAdsBanner" />
      </GridRight>
    </Grid>
  )
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

  const title = 'Publicações Legais'
  const description = `${title} - ${siteMetadata.siteDescription || 'Jornal Diário do Xingu'}`

  return {
    description,
    title,
    openGraph: mergeOpenGraph({
      siteName: siteMetadata.siteName || undefined,
      title,
      url: `${getServerSideURL()}/${COLLECTION_URL_PATHS.NotarialActs}`,
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
