import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// import * as dotenv from 'dotenv'
// dotenv.config()

export const env = createEnv({
  server: {
    DATABASE_URI: z.string().url(),
    PAYLOAD_SECRET: z.string().min(1),
    CRON_SECRET: z.string().min(1),
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: z.string().min(1),

    // Optionals
    UMAMI_WEBSITE_ID: z.string().min(1).optional(),
    UMAMI_URI: z.string().url().optional(),
    SHARP_IGNORE_GLOBAL_LIBVIPS: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string().url(),

    NEXT_PUBLIC_IS_LIVE: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .default('false'),

    NEXT_PUBLIC_USE_PAYLOAD_CLOUD: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .default('true'),
  },
  // You need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_IS_LIVE: process.env.NEXT_PUBLIC_IS_LIVE,
    NEXT_PUBLIC_USE_PAYLOAD_CLOUD: process.env.NEXT_PUBLIC_USE_PAYLOAD_CLOUD,
  },
})
