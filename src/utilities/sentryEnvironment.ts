/**
 * Sentry environment tag. Derived from the site URL rather than the live flag, because
 * local production builds also run with the live flag on and must not report as production.
 */
export const sentryEnvironment = (serverUrl: string | undefined) =>
  serverUrl?.includes('diariodoxingu.com') ? 'production' : 'local'
