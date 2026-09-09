import type { News } from '@/payload-types'

type Input = {
  article: News
  /** Absolute canonical URL of the article page. */
  url: string
  /** Hero image with an absolute URL, if the article has one. */
  image?: { url: string; width?: number; height?: number }
  publisher: {
    name: string
    /** Absolute logo URL, if the site has one. */
    logoUrl?: string
  }
  description: string
}

/**
 * schema.org NewsArticle for an article page. Pure so it can be unit-tested; the route
 * resolves URLs and site data and passes them in. Google lists no required properties,
 * so anything missing is simply left out rather than faked.
 * https://developers.google.com/search/docs/appearance/structured-data/article
 */
export function buildNewsArticleJsonLd({ article, url, image, publisher, description }: Input) {
  const authorNames = article.authors?.flatMap(({ name }) => (name ? [name] : [])) ?? []

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.heading,
    description,
    ...(image && { image: [{ '@type': 'ImageObject', ...image }] }),
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    // Only real bylines: Google asks that the publisher's name never be used as the author.
    ...(authorNames.length > 0 && {
      author: authorNames.map((name) => ({ '@type': 'Person', name })),
    }),
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.logoUrl && { logo: { '@type': 'ImageObject', url: publisher.logoUrl } }),
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(typeof article.category === 'object' && { articleSection: article.category.name }),
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
  }
}

/** Serialises JSON-LD for a script tag; `<` is escaped so content cannot close the tag. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
