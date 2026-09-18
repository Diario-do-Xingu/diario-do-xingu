import { describe, expect, it } from 'vitest'
import { reportsToSentry, sentryEnvironment } from './sentryEnvironment'

describe('sentryEnvironment', () => {
  it('reads the live site as production', () => {
    expect(sentryEnvironment('https://diariodoxingu.com')).toBe('production')
  })

  it('reads a local production build as local, live flag or not', () => {
    expect(sentryEnvironment('http://localhost:3000')).toBe('local')
  })

  it('reads the Payload Cloud preview domain as local, since it is not the site', () => {
    expect(sentryEnvironment('https://diario-do-xingu.payloadcms.app')).toBe('local')
  })
})

describe('reportsToSentry', () => {
  it('reports from the live site', () => {
    expect(reportsToSentry('https://diariodoxingu.com')).toBe(true)
  })

  // A .env copied from the deployment carries the DSN; without this the SDK would happily file
  // every local error against the same project.
  it('stays quiet from localhost even with a DSN configured', () => {
    expect(reportsToSentry('http://localhost:3000')).toBe(false)
  })

  it('stays quiet when there is no server URL at all', () => {
    expect(reportsToSentry(undefined)).toBe(false)
  })
})
