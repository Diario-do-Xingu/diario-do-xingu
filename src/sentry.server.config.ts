import * as Sentry from '@sentry/nextjs'
import { UPLOAD_LIMIT_BYTES, UPLOAD_LIMIT_MESSAGE } from '@/constants'
import { env } from '@/env'
import { QUEUE_DEPTH_SPAN } from '@/payload/hooks/checkInQueueTick'
import { SCHEDULED_PUBLISH_SPAN } from '@/payload/hooks/reportScheduledPublish'
import { reportsToSentry, sentryEnvironment } from '@/utilities/sentryEnvironment'
import {
  isAbortedOversizedUpload,
  isClientDisconnect,
  isServerActionProbe,
  withoutCredentials,
} from '@/utilities/sentryFilters'

// Server-side error reporting. Inert without a DSN, and off anywhere but the live site.
Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  environment: sentryEnvironment(env.NEXT_PUBLIC_SERVER_URL),
  enabled: reportsToSentry(env.NEXT_PUBLIC_SERVER_URL),
  // Errors are the point; traces are sampled lightly to stay well inside the free tier. The
  // exceptions are the measurements: scheduled publishes are a handful a day, and the queue
  // depth is one reading every five minutes; at 10% most would record nothing, which defeats
  // the point of measuring at all.
  tracesSampler: ({ name, inheritOrSampleWith }) =>
    name === SCHEDULED_PUBLISH_SPAN || name === QUEUE_DEPTH_SPAN ? 1 : inheritOrSampleWith(0.1),
  sendDefaultPii: false,
  // An oversized upload is expected behaviour, not an error.
  ignoreErrors: [UPLOAD_LIMIT_MESSAGE],
  beforeSend(event) {
    if (isAbortedOversizedUpload(event, UPLOAD_LIMIT_BYTES)) return null
    if (isServerActionProbe(event)) return null
    if (isClientDisconnect(event)) return null

    return withoutCredentials(event)
  },
})
