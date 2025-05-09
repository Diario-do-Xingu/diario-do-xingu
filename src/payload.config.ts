import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { en } from '@payloadcms/translations/languages/en'
import { pt } from '@payloadcms/translations/languages/pt'

import { env } from '@/env'

import { Users } from '@/payload/collections/Users'
import { Media } from '@/payload/collections/Media'
import { NotarialActs } from '@/payload/collections/NotarialActs'
import { SiteInfo } from '@/payload/globals/SiteInfo'
import { Advertisement } from '@/payload/globals/Advertisement'
import { SiteMetadata } from '@/payload/globals/Metadata'
import { News } from '@/payload/collections/News'
import { Authors } from '@/payload/collections/Authors'
import { NewsCategories } from '@/payload/collections/News/categories'
import { defaultLexical } from '@/payload/fields/defaultLexical'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    timezones: {
      defaultTimezone: 'America/Sao_Paulo',
    },
  },
  i18n: {
    supportedLanguages: {
      en,
      pt,
    },
  },
  collections: [News, NotarialActs, Authors, NewsCategories, Media, Users],
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
  plugins: [
    payloadCloudPlugin({
      debug: !env.NEXT_PUBLIC_IS_LIVE,
    }),
  ],
  jobs: {
    access: {
      run: ({ req }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${env.CRON_SECRET}`
      },
    },
    tasks: [],
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
