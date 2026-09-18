import * as Sentry from '@sentry/nextjs'
import { reportsToSentry, sentryEnvironment } from '@/utilities/sentryEnvironment'

// Browser-side error reporting (hydration failures, client exceptions). No session replay;
// errors are what we want. Values are inlined at build time.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: sentryEnvironment(process.env.NEXT_PUBLIC_SERVER_URL),
  enabled: reportsToSentry(process.env.NEXT_PUBLIC_SERVER_URL),
  // Every pageload: at 0.1 a day's traffic was ten samples, too few to read a chart or tell
  // whether a deploy helped. Browser transactions are a small share of the volume - the server
  // config stays at 0.1, where the bulk is.
  tracesSampleRate: 1,
  sendDefaultPii: false,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
