export const ARCHIVE_LIMIT = {
  Highlights: 4,
  MostRead: 4,
} as const

/**
 * Origins allowed to call the API with credentials (CORS) and to present the auth cookie (CSRF).
 * localhost stays out of production: any process on an editor's machine could bind port 3000.
 */
export const SITE_ORIGINS = [
  ...(process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000']),
  'https://diariodoxingu.com',
  'https://diario-do-xingu.payloadcms.app',
]

/**
 * Image formats accepted by upload collections that run through sharp.
 * Next.js >= 15.5.24 blocks every other libvips loader process-wide (AVIF/HEIF, JXL, ...)
 * as mitigation for GHSA-2xp9-vwfh-vxw4, which also breaks Payload uploads in those formats.
 * Keep this list in sync with what Next leaves unblocked in its image optimizer.
 */
export const IMAGE_UPLOAD_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * Notarial acts arrive as RTF and DOCX far more often than PDF (roughly 540 RTF, 250 DOCX and 5 PDF
 * in production). Payload checks the browser's label as well as the type detected from the bytes.
 * Browsers label `.rtf` as text/rtf, application/rtf or application/msword, so all three are listed;
 * application/msword is only that label, a real legacy `.doc` is still rejected by byte detection.
 */
export const NOTARIAL_ACT_MIME_TYPES = [
  'application/pdf',
  'application/rtf',
  'text/rtf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const COLLECTION_SLUGS = {
  SiteInfo: 'site-info',
  Advertisement: 'advertisement',
  NotarialActs: 'notarial-acts',
  SiteMetadata: 'site-metadata',
  News: 'news',
  NewsCategories: 'news-categories',
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
  DigitalEditions: 'Edições Digitais',
} as const

export const PAGINATED_LIMIT = {
  DigitalEditions: 50,
  News: 20,
  NotarialActs: 10,
} as const

/**
 * Cache tags for the sitemap queries. The collection hooks bust them on manual publish, unpublish
 * and delete; scheduled publishes skip revalidation and rely on the sitemap's time-based refresh.
 */
/** Cache tag and length of the RSS feed; the News hooks bust the tag when an article changes. */
export const FEED_TAG = 'feed-news'
export const FEED_LIMIT = 20

/**
 * Cache tags for the news queries repeated across pages - the sidebar cards and the related
 * articles below an article. The collections' revalidate hooks bust these, so an editor's
 * publish still shows up immediately.
 */
export const SIDEBAR_TAGS = {
  News: 'sidebar-news',
  DigitalEditions: 'sidebar-digital-editions',
} as const

export const SITEMAP_TAGS = {
  News: 'sitemap-news',
  NotarialActs: 'sitemap-notarial-acts',
} as const

/** Upload size cap and the message returned when it is exceeded; both are also used by error reporting. */
export const UPLOAD_LIMIT_BYTES = 64 * 1024 * 1024
export const UPLOAD_LIMIT_MESSAGE = 'O arquivo excede o limite de 64 MB'

/**
 * Embed URLs and account ids for the third-party widgets. All of them are public by design — they
 * end up in the page source — but they are what changes when an account or a season does, so they
 * are named here instead of being buried in JSX.
 */
export const API_FUTEBOL_WIDGETS = {
  /** Fixtures block in the news sidebar. */
  Rounds: 'https://api.api-futebol.com.br/v1/widgets/rodadas?client_id=LV2R34S6LAMK',
  /** Standings on /tabela-brasileirao; each division is a separate embed. */
  SerieA: 'https://api.api-futebol.com.br/v1/widgets/tabela?client_id=LMUN57AVY9XJ',
  SerieB: 'https://api.api-futebol.com.br/v1/widgets/tabela?client_id=7KDJD7KWHXPS',
} as const

/** Tomorrow.io weather widget: the SDK it injects and the station it reports, Altamira. */
export const TOMORROW_WIDGET = {
  SdkUrl: 'https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js',
  LocationId: '010153',
} as const

/** TradingView ticker tape in the header. */
export const TRADINGVIEW_TICKER_SRC =
  'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
