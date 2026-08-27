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
import { defaultLexical } from '@/payload/fields/defaultLexical'
import { Advertisement } from '@/payload/globals/Advertisement'
import { SiteMetadata } from '@/payload/globals/Metadata'
import { SiteInfo } from '@/payload/globals/SiteInfo'
import { schedulePublish } from '@/payload/handlers/schedule-publish'
import { DigitalEditions } from './payload/collections/DigitalEditions'
import { DigitalEditionMedia } from './payload/collections/DigitalEditions/media'
import { ArticleMedia } from './payload/collections/News/ArticleMedia'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
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
  jobs: {
    access: {
      run: ({ req }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${env.CRON_SECRET}`
      },
    },
    tasks: [schedulePublish],
    autoRun: [
      {
        cron: '* * * * *',
        queue: 'default',
      },
    ],
    shouldAutoRun: () => {
      return true
    },
  },
})
