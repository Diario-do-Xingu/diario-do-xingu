export const WEBSITE_TITLE = 'Diário do Xingu' as const

export const ARCHIVE_LIMIT = {
  News: 10,
  NotarialActs: 10,
  Highlights: 4,
  MostRead: 4,
} as const

export const COLLECTION_SLUGS = {
  SiteInfo: 'site-info',
  Advertisement: 'advertisement',
  NotarialActs: 'notarial-acts',
  SiteMetadata: 'site-metadata',
  News: 'news',
  NewsCategories: 'news-categories',
  Authors: 'authors',
} as const

export const COLLECTION_URL_PATHS = {
  NotarialActs: 'publicacoes-legais',
  News: 'noticias',
} as const

export const COLLECTION_GROUP = {
  Configuration: 'Configuração',
} as const
