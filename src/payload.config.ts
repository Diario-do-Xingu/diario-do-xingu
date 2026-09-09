import { timingSafeEqual } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { pt } from '@payloadcms/translations/languages/pt'
import * as Sentry from '@sentry/nextjs'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { UPLOAD_LIMIT_BYTES, UPLOAD_LIMIT_MESSAGE } from '@/constants'
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
import { reportWhenRetriesExhausted } from '@/payload/hooks/reportExhaustedJob'
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
  // One global cap; the largest legitimate upload today is a 58 MB digital-edition PDF. Without
  // abortOnLimit the parser truncates the file instead of rejecting the request.
  upload: {
    limits: { fileSize: UPLOAD_LIMIT_BYTES },
    abortOnLimit: true,
    responseOnLimit: UPLOAD_LIMIT_MESSAGE,
  },
  cors: {
    origins: [
      'http://localhost:3000',
      'https://diariodoxingu.com',
      'https://diario-do-xingu.payloadcms.app',
    ],
  },
  plugins: [
    // Reports Payload request errors (status 500+) to Sentry. The plugin's default context
    // would attach the editor's email and IP; keep only the user id.
    sentryPlugin({
      Sentry,
      options: {
        context: ({ defaultContext, req }) => ({
          ...defaultContext,
          user: req.user ? { id: String(req.user.id) } : undefined,
        }),
      },
    }),
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

const SCHEDULE_PUBLISH_RETRIES = 5

// Payload registers its built-in schedulePublish task during sanitisation with no retries,
// so one transient failure (a database blip at the scheduled minute) would drop a scheduled
// publish for good. Give it a retry budget, and report to Sentry when that budget runs out.
export default config.then((sanitized) => {
  const schedulePublish = sanitized.jobs.tasks?.find(({ slug }) => slug === 'schedulePublish')
  if (schedulePublish) {
    schedulePublish.retries = SCHEDULE_PUBLISH_RETRIES
    schedulePublish.onFail = reportWhenRetriesExhausted(SCHEDULE_PUBLISH_RETRIES)
  }

  // The Sentry plugin also mounts an admin error boundary built on its own, older copy of the
  // SDK, which never sees this app's Sentry client and renders a blank page when it catches.
  // Drop it: admin errors fall through to src/app/global-error.tsx, which reports and shows a
  // message. The plugin's server-side capture of Payload errors is what we keep.
  const providers = sanitized.admin.components?.providers
  if (providers) {
    sanitized.admin.components.providers = providers.filter(
      (provider) => provider !== '@payloadcms/plugin-sentry/client#AdminErrorBoundary',
    )
  }

  return sanitized
})
