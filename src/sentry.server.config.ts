import * as Sentry from '@sentry/nextjs'
import { UPLOAD_LIMIT_BYTES, UPLOAD_LIMIT_MESSAGE } from '@/constants'
import { env } from '@/env'
import { sentryEnvironment } from '@/utilities/sentryEnvironment'
import {
  isAbortedOversizedUpload,
  isServerActionProbe,
  withoutCredentials,
} from '@/utilities/sentryFilters'

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
    if (isAbortedOversizedUpload(event, UPLOAD_LIMIT_BYTES)) return null
    if (isServerActionProbe(event)) return null

    return withoutCredentials(event)
  },
})
