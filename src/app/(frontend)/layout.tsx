import React from 'react'
import './globals.css'

import { Open_Sans, Varela_Round } from 'next/font/google'
import localFont from 'next/font/local'
import { cn } from '@/utilities/ui'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Media, SiteMetadatum } from '@/payload-types'
import { Metadata } from 'next'
import { COLLECTION_SLUGS } from '@/constants'
import { Umami } from '@/lib/umami'
import { env } from '@/env'
import { getCachedGlobal } from '@/utilities/getGlobals'

const globoFont = localFont({
  src: [
    {
      path: '../../assets/fonts/globo.woff2',
      weight: '400',
    },
    {
      path: '../../assets/fonts/globo.woff2',
      weight: '500',
    },
    {
      path: '../../assets/fonts/globo.woff2',
      weight: '600',
    },
    {
      path: '../../assets/fonts/globo.woff2',
      weight: '700',
    },
    {
      path: '../../assets/fonts/globo.woff2',
      weight: '800',
    },
  ],

  display: 'swap',
  variable: '--font-globo',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-open-sans',
})
const varelaRound = Varela_Round({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-varela-round',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <>
      <html
        lang="pt"
        className={cn(openSans.variable, varelaRound.variable, globoFont.variable, 'antialiased')}
        suppressHydrationWarning
      >
        {!!env.UMAMI_WEBSITE_ID && !!env.UMAMI_URI && (
          <Umami
            umamiWebsiteId={env.UMAMI_WEBSITE_ID}
            umamiAutoTrack={true}
            umamiExcludeSearch
            trackOutboundLinks
          />
        )}

        <body className="bg-zinc-100">
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </>
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

  const title = siteMetadata.siteTitle || 'Diário do Xingu - Portal de Notícias'
  const description = siteMetadata.siteDescription || 'Jornal Diário do Xingu'

  return {
    metadataBase: new URL(getServerSideURL()),
    description,
    title,
    openGraph: mergeOpenGraph({
      description,
      siteName: siteMetadata.siteName || undefined,
      title,
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
