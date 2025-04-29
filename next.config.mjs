import { withPayload } from '@payloadcms/next/withPayload'
import { createJiti } from 'jiti'
import { fileURLToPath } from 'url'

const jiti = createJiti(fileURLToPath(import.meta.url))
await jiti.import('./src/env')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
