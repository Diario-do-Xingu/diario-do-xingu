import type { Metadata } from 'next'
import type React from 'react'
import { COLLECTION_URL_PATHS } from '@/constants'
import { getSiteMeta } from '@/utilities/getSiteMeta'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return children
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteName, siteDescription, images } = await getSiteMeta()

  const title = 'Notícias'
  const description = `${title} - ${siteDescription}`

  return {
    description,
    // Keep the root template so detail pages below still get the site suffix.
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    openGraph: mergeOpenGraph({
      description,
      siteName,
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
