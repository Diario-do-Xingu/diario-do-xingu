import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URI: z.string().url(),
    PAYLOAD_SECRET: z.string().min(1),
    CRON_SECRET: z.string().min(1),
    PREVIEW_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string().url(),
    NEXT_PUBLIC_IS_DEV: z
      .string()

      // only allow "true" or "false".
      .refine((s) => s === 'true' || s === 'false')
      // transform to boolean
      .transform((s) => s === 'true')
      .default('false'),

    // TODO: Remove
    NEXT_PUBLIC_FEATURE_NOTARIAL_ACT_LINK: z
      .string()
      // only allow "true" or "false".
      .refine((s) => s === 'true' || s === 'false')
      // transform to boolean
      .transform((s) => s === 'true')
      .default('false'),
  },
  // You need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_IS_DEV: process.env.NEXT_PUBLIC_IS_DEV,
    NEXT_PUBLIC_FEATURE_NOTARIAL_ACT_LINK: process.env.NEXT_PUBLIC_FEATURE_NOTARIAL_ACT_LINK,
  },
})
