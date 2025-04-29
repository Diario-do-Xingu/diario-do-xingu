import React from 'react'
import './globals.css'

import { Open_Sans, Varela_Round } from 'next/font/google'
import localFont from 'next/font/local'
import { cn } from '@/utilities/ui'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Media } from '@/payload-types'
import { getPayload } from '@/lib/payload/getPayload'
import { Metadata } from 'next'
import { COLLECTION_SLUGS } from '@/constants'

const globoFont = localFont({
  src: [
    {
      path: '../../fonts/globo.woff2',
      weight: '400',
    },
    {
      path: '../../fonts/globo.woff2',
      weight: '500',
    },
    {
      path: '../../fonts/globo.woff2',
      weight: '600',
    },
    {
      path: '../../fonts/globo.woff2',
      weight: '700',
    },
    {
      path: '../../fonts/globo.woff2',
      weight: '800',
    },
  ],
  // src: '../../fonts/globo.woff2',
  display: 'swap',
  variable: '--font-globo',
  // weight: '500',
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
    <html
      lang="en"
      className={cn(openSans.variable, varelaRound.variable, globoFont.variable, 'antialiased')}
    >
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
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

  return {
    metadataBase: new URL(getServerSideURL()),
    description: siteMetadata.siteDescription,
    title: siteMetadata.siteTitle,
    openGraph: await mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      title: siteMetadata.siteTitle,
      description: siteMetadata.siteDescription,
      images: [
        {
          url: `${getServerSideURL()}/media/${shareImage.filename}`,
          secureUrl: `${getServerSideURL()}/media/${shareImage.filename}`,
          alt: siteMetadata.cardShareImageAlt ?? siteMetadata.siteTitle,
        },
      ],
    },
  }
}
