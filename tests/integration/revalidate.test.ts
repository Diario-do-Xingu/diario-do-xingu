import { describe, expect, it } from 'vitest'
import { BASE_URL } from './client'

/**
 * The route exists so the job queue can revalidate from outside a request. It carries the same
 * power as a publish, so the guard matters as much as the behaviour.
 */
const post = (body: unknown, authorization?: string) =>
  fetch(`${BASE_URL}/api/revalidate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify(body),
  })

const CRON_SECRET = process.env.INTEGRATION_CRON_SECRET ?? 'ci-only-not-a-secret'

describe('/api/revalidate', () => {
  it('refuses a request with no credentials', async () => {
    expect((await post({ paths: ['/'] })).status).toBe(401)
  })

  it('refuses a wrong secret', async () => {
    expect((await post({ paths: ['/'] }, 'Bearer definitely-not-the-secret')).status).toBe(401)
  })

  it('revalidates the paths and tags it is given', async () => {
    const res = await post(
      { paths: ['/', '/noticias'], tags: ['sitemap-news'] },
      `Bearer ${CRON_SECRET}`,
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ paths: 2, tags: 1 })
  })

  it('ignores anything in the body that is not a string path or tag', async () => {
    const res = await post(
      { paths: ['/', 42, null], tags: 'not-an-array' },
      `Bearer ${CRON_SECRET}`,
    )

    expect(await res.json()).toEqual({ paths: 1, tags: 0 })
  })

  it('does not shadow the Payload REST API on the same prefix', async () => {
    expect((await fetch(`${BASE_URL}/api/news?limit=1`)).status).toBe(200)
  })
})
