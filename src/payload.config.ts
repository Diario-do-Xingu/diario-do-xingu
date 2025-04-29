// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { env } from '@/env'
import { migrations } from '@/migrations'

import { Users } from '@/payload/collections/Users'
import { Media } from '@/payload/collections/Media'
import { NotarialActs } from '@/payload/collections/NotarialActs'
import { SiteInfo } from '@/payload/globals/SiteInfo'
import { Advertisement } from '@/payload/globals/Advertisement'
import { SiteMetadata } from '@/payload/globals/Metadata'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [NotarialActs, Media, Users],
  globals: [SiteInfo, Advertisement, SiteMetadata],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI || '',
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
