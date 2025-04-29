import React from 'react'
import './globals.css'

import { Open_Sans, Varela_Round } from 'next/font/google'
import { cn } from '@/utilities/ui'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { SiteMetadatum } from '@/payload-types'
import { getShareImageUrl } from '@/utilities/getShareImage'

const siteMetadata = (await getCachedGlobal('site-metadata')()) as SiteMetadatum
const cardShareImage = await getShareImageUrl()

export const metadata = {
  metadataBase: new URL(getServerSideURL()),
  description: siteMetadata.siteDescription,
  title: siteMetadata.siteTitle,
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.siteTitle,
    description: siteMetadata.siteDescription,
    image: cardShareImage,
  },
}

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
    <html lang="en" className={cn(openSans.variable, varelaRound.variable)}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
