import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import { createJiti } from 'jiti'

const jiti = createJiti(fileURLToPath(import.meta.url))
await jiti.import('./src/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Biome replaces ESLint in this project; keep Next from picking up any stray
  // ESLint install/config during builds.
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    const headers = []

    // Prevent search engines from indexing the site if it is not live
    // This is useful for staging environments before they are ready to go live
    // To allow robots to crawl the site, use the `NEXT_PUBLIC_IS_LIVE` env variable
    // You may want to also use this variable to conditionally render any tracking scripts
    if (!process.env.NEXT_PUBLIC_IS_LIVE) {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        source: '/:path*',
      })
    }

    return headers
  },
  images: {
    qualities: [100],
    remotePatterns: [
      ...['http://localhost:3000', process.env.NEXT_PUBLIC_SERVER_URL].map((item) => {
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
