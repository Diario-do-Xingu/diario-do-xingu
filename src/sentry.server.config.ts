import * as Sentry from '@sentry/nextjs'
import { UPLOAD_LIMIT_BYTES, UPLOAD_LIMIT_MESSAGE } from '@/constants'
import { env } from '@/env'
import { sentryEnvironment } from '@/utilities/sentryEnvironment'

// Server-side error reporting. With no DSN configured (local dev) the SDK stays inert.
Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  environment: sentryEnvironment(env.NEXT_PUBLIC_SERVER_URL),
  // Errors are the point; traces are sampled lightly to stay well inside the free tier.
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  // An oversized upload is expected behaviour, not an error.
  ignoreErrors: [UPLOAD_LIMIT_MESSAGE],
  beforeSend(event) {
    // Aborting an oversized upload also makes the multipart parser report an unfinished
    // form. Drop that only when the request really was over the limit, so a reader's
    // connection dropping mid-upload still shows up.
    if (isUnfinishedForm(event) && declaredLength(event) > UPLOAD_LIMIT_BYTES) return null

    // `sendDefaultPii: false` does not strip request headers or cookies from captured
    // request errors, and those can carry the admin session token or the cron secret.
    if (event.request) {
      delete event.request.cookies
      if (event.request.headers) {
        delete event.request.headers.cookie
        delete event.request.headers.authorization
      }
    }
    return event
  },
})

const isUnfinishedForm = (event: Sentry.ErrorEvent) =>
  event.exception?.values?.some(({ value }) => value?.includes('Unexpected end of form')) ?? false

const declaredLength = (event: Sentry.ErrorEvent) =>
  Number(event.request?.headers?.['content-length'] ?? 0)
