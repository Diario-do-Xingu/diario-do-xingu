import type React from 'react'
import { buildPageMetadata } from '@/utilities/buildPageMetadata'
import './globals.css'

import { Open_Sans, Varela_Round } from 'next/font/google'
import localFont from 'next/font/local'
import { Advertisement } from '@/components/Advertisement'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { env } from '@/env'
import { Umami } from '@/lib/umami'
import { cn } from '@/utilities/ui'

// One file covers every weight the site uses; declaring it once per weight preloaded it five times.
const globoFont = localFont({
  src: '../../assets/fonts/globo.woff2',
  weight: '400 800',
  display: 'swap',
  // Not --font-globo: that is the Tailwind theme key, and `--font-globo:
  // var(--font-globo)` would be a self-referential custom property.
  variable: '--font-globo-family',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
      lang="pt-BR"
      className={cn(openSans.variable, varelaRound.variable, globoFont.variable, 'antialiased')}
      suppressHydrationWarning
    >
      <body className="grid min-h-screen grid-cols-1 grid-rows-[max-content_1fr_max-content] bg-zinc-100 has-[.topAdsBanner]:grid-rows-[max-content_min-content_1fr_max-content]">
        <Header />

        <div className="container mx-auto mt-8 hidden justify-center has-[.topAdsBanner]:flex">
          <Advertisement
            adType="topAdsBanner"
            containerClassName="p-1 rounded-sm"
            imgClassName="rounded-sm"
          />
        </div>

        <main>{children}</main>
        <Footer />

        {!!env.UMAMI_WEBSITE_ID && !!env.UMAMI_URI && (
          <Umami
            umamiWebsiteId={env.UMAMI_WEBSITE_ID}
            umamiAutoTrack={true}
            umamiExcludeSearch
            trackOutboundLinks
          />
        )}
      </body>
    </html>
  )
}

export const generateMetadata = () => buildPageMetadata()
