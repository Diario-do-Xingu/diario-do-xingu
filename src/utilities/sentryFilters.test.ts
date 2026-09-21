import type { ErrorEvent } from '@sentry/nextjs'
import { describe, expect, it } from 'vitest'
import {
  isAbortedOversizedUpload,
  isClientDisconnect,
  isServerActionProbe,
  withoutCredentials,
} from './sentryFilters'

const LIMIT = 64 * 1024 * 1024

const event = (message: string, headers: Record<string, string> = {}) =>
  ({
    exception: { values: [{ value: message }] },
    request: { headers },
  }) as unknown as ErrorEvent

/** The shape Sentry actually captured for the scanner: multipart, 134 KB, no next-action. */
const scannerProbe = event(
  'Failed to find Server Action. This request might be from an older or newer deployment.',
  {
    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryc0c2e78c47d3abcd',
    'content-length': '136912',
  },
)

describe('isServerActionProbe', () => {
  it('matches a scanner posting a form to a page route', () => {
    expect(isServerActionProbe(scannerProbe)).toBe(true)
  })

  it('keeps a real deploy-skew error, which carries the action id', () => {
    const skew = event('Failed to find Server Action. This request might be from an older', {
      'next-action': '7f9c1d2e4b6a8c0e2f4a6b8c0d2e4f6a8b0c2d4e',
      'content-type': 'multipart/form-data; boundary=----x',
    })

    expect(isServerActionProbe(skew)).toBe(false)
  })

  it('leaves unrelated errors alone', () => {
    expect(isServerActionProbe(event('Cannot read properties of undefined'))).toBe(false)
  })
})

describe('isAbortedOversizedUpload', () => {
  it('matches an unfinished form that was over the limit', () => {
    const tooBig = event('Unexpected end of form', { 'content-length': `${LIMIT + 1}` })

    expect(isAbortedOversizedUpload(tooBig, LIMIT)).toBe(true)
  })

  it('keeps a connection that dropped mid-upload under the limit', () => {
    const dropped = event('Unexpected end of form', { 'content-length': '1024' })

    expect(isAbortedOversizedUpload(dropped, LIMIT)).toBe(false)
  })

  it('keeps an unfinished form with no declared length', () => {
    expect(isAbortedOversizedUpload(event('Unexpected end of form'), LIMIT)).toBe(false)
  })
})

describe('isClientDisconnect', () => {
  it('matches a response stream the client closed early', () => {
    expect(isClientDisconnect(event('The destination stream closed early.'))).toBe(true)
  })

  it('matches a request body the client cut off', () => {
    expect(isClientDisconnect(event('aborted'))).toBe(true)
  })

  it('keeps an error that merely mentions aborting', () => {
    expect(isClientDisconnect(event('Upload aborted by the storage adapter'))).toBe(false)
  })
})

describe('withoutCredentials', () => {
  it('strips the session cookie and the authorization header', () => {
    const captured = {
      exception: { values: [{ value: 'boom' }] },
      request: {
        cookies: { 'payload-token': 'secret' },
        headers: { cookie: 'payload-token=secret', authorization: 'Bearer secret', host: 'x' },
      },
    } as unknown as ErrorEvent

    const cleaned = withoutCredentials(captured)

    expect(cleaned.request?.cookies).toBeUndefined()
    expect(cleaned.request?.headers?.cookie).toBeUndefined()
    expect(cleaned.request?.headers?.authorization).toBeUndefined()
    // everything else survives, so the event stays useful
    expect(cleaned.request?.headers?.host).toBe('x')
  })

  it('handles an event with no request at all', () => {
    expect(() => withoutCredentials(event('boom'))).not.toThrow()
  })
})
