import { withPayload } from '@payloadcms/next/withPayload'
import { createJiti } from 'jiti'

import { fileURLToPath } from 'url'

const jiti = createJiti(fileURLToPath(import.meta.url))
await jiti.import('./src/env')

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const isDev = process.env.NEXT_PUBLIC_IS_DEV ? process.env.NEXT_PUBLIC_IS_DEV === 'true' : false

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      }),
    )
    return config
  },
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
