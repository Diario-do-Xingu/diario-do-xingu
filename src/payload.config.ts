import { timingSafeEqual } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { pt } from '@payloadcms/translations/languages/pt'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { env } from '@/env'
import { Media } from '@/payload/collections/Media'
import { News } from '@/payload/collections/News'
import { NewsCategories } from '@/payload/collections/News/categories'
import { NotarialActs } from '@/payload/collections/NotarialActs'
import { Users } from '@/payload/collections/Users'
import { checkRole } from '@/payload/collections/Users/checkRole'
import { defaultLexical } from '@/payload/fields/defaultLexical'
import { Advertisement } from '@/payload/globals/Advertisement'
import { SiteMetadata } from '@/payload/globals/Metadata'
import { SiteInfo } from '@/payload/globals/SiteInfo'
import { DigitalEditions } from './payload/collections/DigitalEditions'
import { DigitalEditionMedia } from './payload/collections/DigitalEditions/media'
import { ArticleMedia } from './payload/collections/News/ArticleMedia'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    timezones: {
      defaultTimezone: 'America/Sao_Paulo',
    },
    components: {
      graphics: {
        Logo: '@/payload/logo#AdminLogo',
        Icon: '@/payload/logo#AdminIcon',
      },
      logout: {
        Button: '@/payload/components/SignOutButton#SignOutButton',
      },
    },
    meta: {
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/apple-icon.png',
        },
      ],
    },
  },
  i18n: {
    supportedLanguages: {
      pt,
    },
  },
  collections: [
    News,
    NewsCategories,
    ArticleMedia,
    NotarialActs,
    DigitalEditions,
    DigitalEditionMedia,
    Media,
    Users,
  ],
  globals: [SiteInfo, Advertisement, SiteMetadata],
  editor: defaultLexical,
  secret: env.PAYLOAD_SECRET,
  serverURL: env.NEXT_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: env.DATABASE_URI,
  }),
  sharp,
  cors: {
    origins: [
      'http://localhost:3000',
      'https://diariodoxingu.com',
      'https://diario-do-xingu.payloadcms.app',
    ],
  },
  plugins: [
    ...(env.NEXT_PUBLIC_USE_PAYLOAD_CLOUD
      ? [
          payloadCloudPlugin({
            debug: !env.NEXT_PUBLIC_IS_LIVE,
          }),
        ]
      : []),
  ],
  // The public site reads through the Local API and the admin panel uses REST; nothing uses GraphQL.
  graphQL: {
    disable: true,
  },
  // The frontend never populates deeper than 2.
  maxDepth: 3,
  jobs: {
    access: {
      // Only admins or the cron caller may force the queue to run; everyone else gets 401.
      run: ({ req }): boolean => {
        if (checkRole(['admin'], req.user)) return true
        const given = Buffer.from(req.headers.get('authorization') ?? '')
        const expected = Buffer.from(`Bearer ${env.CRON_SECRET}`)
        return given.length === expected.length && timingSafeEqual(given, expected)
      },
    },
    // Payload registers its own schedulePublish task (drafts.schedulePublish); no custom tasks.
    tasks: [],
    autoRun: [
      {
        cron: '* * * * *',
        queue: 'default',
      },
    ],
  },
})

// Payload registers its built-in schedulePublish task during sanitisation with no retries,
// so one transient failure (a database blip at the scheduled minute) would drop a scheduled
// publish for good. Give it the same retry budget the previous custom task had.
export default config.then((sanitized) => {
  const schedulePublish = sanitized.jobs.tasks?.find(({ slug }) => slug === 'schedulePublish')
  if (schedulePublish) schedulePublish.retries = 5
  return sanitized
})
