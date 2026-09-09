import * as Sentry from '@sentry/nextjs'
import { env } from '@/env'
import { sentryEnvironment } from '@/utilities/sentryEnvironment'

// Server-side error reporting. With no DSN configured (local dev) the SDK stays inert.
Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  environment: sentryEnvironment(env.NEXT_PUBLIC_SERVER_URL),
  // Errors are the point; traces are sampled lightly to stay well inside the free tier.
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  // `sendDefaultPii: false` does not strip request headers or cookies from captured
  // request errors, and those can carry the admin session token or the cron secret.
  beforeSend(event) {
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
