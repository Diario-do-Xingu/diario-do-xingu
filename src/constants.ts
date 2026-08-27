export const WEBSITE_TITLE = 'Diário do Xingu' as const

export const ARCHIVE_LIMIT = {
  News: 10,
  NotarialActs: 10,
  Highlights: 4,
  MostRead: 4,
} as const

/**
 * Image formats accepted by upload collections that run through sharp.
 * Next.js >= 15.5.24 blocks every other libvips loader process-wide (AVIF/HEIF, JXL, ...)
 * as mitigation for GHSA-2xp9-vwfh-vxw4, which also breaks Payload uploads in those formats.
 * Keep this list in sync with what Next leaves unblocked in its image optimizer.
 */
export const IMAGE_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]

export const COLLECTION_SLUGS = {
  SiteInfo: 'site-info',
  Advertisement: 'advertisement',
  NotarialActs: 'notarial-acts',
  SiteMetadata: 'site-metadata',
  News: 'news',
  NewsCategories: 'news-categories',
  Authors: 'authors',
  DigitalEditions: 'digital-editions',
  DigitalEditionThumbs: 'digital-edition-thumbs',
} as const

export const COLLECTION_URL_PATHS = {
  NotarialActs: 'publicacoes-legais',
  News: 'noticias',
  DigitalEditions: 'edicoes-digitais',
} as const

export const COLLECTION_GROUP = {
  Configuration: 'Configuração',
  Articles: 'Notícias',
  NotarialActs: 'Atos Notariais',
} as const

export const PAGINATED_LIMIT = {
  DigitalEditions: 50,
  News: 20,
  NotarialActs: 10,
} as const
