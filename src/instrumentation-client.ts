import * as Sentry from '@sentry/nextjs'
import { sentryEnvironment } from '@/utilities/sentryEnvironment'

// Browser-side error reporting (hydration failures, client exceptions). No session replay;
// errors are what we want. Values are inlined at build time.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: sentryEnvironment(process.env.NEXT_PUBLIC_SERVER_URL),
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
