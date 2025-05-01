import React from 'react'

import { Card } from '@/components/ui/card'
import { WeatherWidget } from '@/components/WeatherWidget'
import { SoccerWidget } from '@/components/SoccerWidget'
import { Advertisement } from '@/components/Advertisement'
import { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { Media, SiteMetadatum } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div className="container grid grid-cols-1 gap-10 lg:grid-cols-12">
      {children}

      <div className="col-span-1 flex flex-col gap-4 lg:col-span-4">
        <Card className="bg-accent p-3">
          <WeatherWidget />
        </Card>

        <Card className="bg-secondary p-3">
          <SoccerWidget />
        </Card>

        <Advertisement />
      </div>
    </div>
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
