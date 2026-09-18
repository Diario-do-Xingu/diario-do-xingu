/**
 * Sentry environment tag. Derived from the site URL rather than the live flag, because
 * local production builds also run with the live flag on and must not report as production.
 */
export const sentryEnvironment = (serverUrl: string | undefined) =>
  serverUrl?.includes('diariodoxingu.com') ? 'production' : 'local'

/**
 * Only the live site reports. A local .env that carries the DSN - a copy of the deployed one, say
 * - would otherwise file every dev error against the same project, where it spends the quota and
 * reads as a live incident.
 */
export const reportsToSentry = (serverUrl: string | undefined) =>
  sentryEnvironment(serverUrl) === 'production'
