// Next only matches robots and manifest files at the app root (anchored matcher); sitemap.ts
// can live inside the (frontend) group, this file cannot.
import type { MetadataRoute } from 'next'
import { env } from '@/env'
import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  // Staging and previews must stay out of search engines entirely.
  if (!env.NEXT_PUBLIC_IS_LIVE) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/*/file/'],
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${getServerSideURL()}/sitemap.xml`,
  }
}
