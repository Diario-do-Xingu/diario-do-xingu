import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Next encrypts the arguments bound to a server action with this key, and takes exactly 32 bytes.
 * Anything else throws on every page that renders one - the admin, in practice - instead of at
 * boot, so it is worth checking here. `atob` is the one base64 decoder node, the edge and the
 * browser all have.
 */
const isEncryptionKey = (value: string) => {
  try {
    return atob(value).length === 32
  } catch {
    return false
  }
}

export const env = createEnv({
  server: {
    DATABASE_URI: z.url(),
    PAYLOAD_SECRET: z.string().min(1),
    CRON_SECRET: z.string().min(1),
    NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: z.string().refine(isEncryptionKey, {
      message:
        "must be 32 bytes of base64: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"",
    }),

    // Optionals
    /** Set by Payload Cloud itself; absent locally and in CI. */
    PAYLOAD_CLOUD: z
      .string()
      .optional()
      .transform((s) => s === 'true'),
    /** Bucket names, S3 keys and Cognito details in the log. Off unless asked for. */
    PAYLOAD_CLOUD_DEBUG: z
      .string()
      .optional()
      .transform((s) => s === 'true'),
    UMAMI_WEBSITE_ID: z.string().min(1).optional(),
    UMAMI_URI: z.url().optional(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url(),
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),

    NEXT_PUBLIC_IS_LIVE: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .default(false),

    NEXT_PUBLIC_USE_PAYLOAD_CLOUD: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .default(true),

    // Set by next.config.mjs at build time (not by .env), so optional when the config itself loads this file
    NEXT_PUBLIC_APP_VERSION: z.string().min(1).optional(),
    NEXT_PUBLIC_APP_COMMIT: z.string().min(1).optional(),
  },
  // You need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_APP_COMMIT: process.env.NEXT_PUBLIC_APP_COMMIT,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_IS_LIVE: process.env.NEXT_PUBLIC_IS_LIVE,
    NEXT_PUBLIC_USE_PAYLOAD_CLOUD: process.env.NEXT_PUBLIC_USE_PAYLOAD_CLOUD,
  },
  // dotenv loads `KEY=` as "", so the blank optionals in .env.example must count as unset
  emptyStringAsUndefined: true,
})
