import type { Metadata } from 'next'
import { env } from '@/env'
import { getSiteMeta } from './getSiteMeta'
import { mergeOpenGraph } from './mergeOpenGraph'

type Section = {
  /** Shown as the page title and prefixed to the description, e.g. `Notícias`. */
  title: string
  /** Path below the site root, e.g. `noticias`, used as the canonical OG url. */
  path: string
}

/**
 * Metadata for a top-level page, from the SiteMetadata global.
 *
 * Called without a section it describes the site itself, which is what the root layout needs.
 * Either way it keeps the root title template, so detail pages nested below still get the
 * `... | Diário do Xingu` suffix.
 */
export async function buildPageMetadata(section?: Section): Promise<Metadata> {
  const { siteName, siteTitle, siteDescription, images } = await getSiteMeta()

  const title = section?.title ?? siteTitle
  const description = section ? `${section.title} - ${siteDescription}` : siteDescription

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL),
    description,
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    openGraph: mergeOpenGraph({
      description,
      siteName,
      title,
      ...(section && { url: `${env.NEXT_PUBLIC_SERVER_URL}/${section.path}` }),
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
