import * as Sentry from '@sentry/nextjs'
import type { AfterErrorHook } from 'payload'

/**
 * Reports Payload request errors (status 500 and up) to Sentry, with the user id as the only
 * personal data. Replaces @payloadcms/plugin-sentry, which pinned an older SDK and pulled a
 * second OpenTelemetry tree into the build.
 */
export const reportPayloadError: AfterErrorHook = ({ collection, error, req }) => {
  // Payload types `error` as Error, but whatever was thrown reaches this hook untouched.
  const status = (error as { status?: unknown } | null)?.status
  if (typeof status === 'number' && status < 500) return

  Sentry.captureException(error, {
    extra: { errorCollectionSlug: collection?.slug },
    user: req.user ? { id: String(req.user.id) } : undefined,
  })
}
