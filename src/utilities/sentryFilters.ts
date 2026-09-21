import type { ErrorEvent } from '@sentry/nextjs'

const header = (event: ErrorEvent, name: string) => event.request?.headers?.[name]

const matches = (event: ErrorEvent, text: string) =>
  event.exception?.values?.some(({ value }) => value?.includes(text)) ?? false

/**
 * Aborting an oversized upload also makes the multipart parser report an unfinished form.
 * Only the requests that really were over the limit are noise; a reader's connection dropping
 * mid-upload is a genuine error.
 */
export const isAbortedOversizedUpload = (event: ErrorEvent, limitBytes: number) =>
  matches(event, 'Unexpected end of form') &&
  Number(header(event, 'content-length') ?? 0) > limitBytes

/**
 * Next treats a multipart POST to a page route as a server action, so a scanner posting a file
 * to `/` produces a 500 and an error event several times a minute. There is nothing to fix in
 * the page, and the requests are not readers.
 *
 * A real deploy-skew error - a reader's stale tab calling an action that no longer exists -
 * raises the same message but carries a `next-action` header, and that is worth keeping.
 */
export const isServerActionProbe = (event: ErrorEvent) =>
  matches(event, 'Failed to find Server Action') && !header(event, 'next-action')

/**
 * A client that hangs up before the response finishes: React's Flight streamer reports "The
 * destination stream closed early" on an abandoned RSC or server-action response, and Node
 * reports a bare "aborted" when the request body is cut off. Both reach `onRequestError` as
 * unhandled, but nothing on the server failed, and a bot that runs the page's JavaScript and
 * drops the read-count action re-opens the issue after every deploy.
 */
export const isClientDisconnect = (event: ErrorEvent) =>
  matches(event, 'The destination stream closed early') ||
  (event.exception?.values?.some(({ value }) => value === 'aborted') ?? false)

/**
 * `sendDefaultPii: false` does not strip request headers or cookies from captured request
 * errors, and those can carry the admin session token or the cron secret.
 */
export const withoutCredentials = (event: ErrorEvent) => {
  if (event.request) {
    delete event.request.cookies
    if (event.request.headers) {
      delete event.request.headers.cookie
      delete event.request.headers.authorization
    }
  }
  return event
}
