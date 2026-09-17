import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { api, BASE_URL } from './client'
import { articleFixtures, newsBody } from './fixtures'

type NewsDoc = { id: string }

let fixtures: Awaited<ReturnType<typeof articleFixtures>>
const created: string[] = []

const feed = async () => {
  const res = await fetch(`${BASE_URL}/feed.xml`, { cache: 'no-store' })
  return { status: res.status, type: res.headers.get('content-type'), xml: await res.text() }
}

beforeAll(async () => {
  fixtures = await articleFixtures()
})

afterAll(async () => {
  for (const id of created) await api(`/news/${id}`, { method: 'DELETE' })
})

describe('/feed.xml', () => {
  it('serves RSS with the channel pointing back at itself', async () => {
    const { status, type, xml } = await feed()

    expect(status).toBe(200)
    expect(type).toContain('application/rss+xml')
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain(`<atom:link href="${BASE_URL}/feed.xml"`)
  })

  it('picks up an article as it is published and drops it when it is unpublished', async () => {
    const heading = `Feed ${Date.now()}`
    const slug = `feed-${Date.now()}`

    const { json } = await api<{ doc?: NewsDoc }>('/news', {
      method: 'POST',
      body: newsBody(fixtures, { _status: 'published', slug, heading, subheading: 'Chamada' }),
    })
    if (!json.doc) throw new Error('Could not create the article')
    created.push(json.doc.id)

    const published = await feed()
    expect(published.xml).toContain(heading)
    expect(published.xml).toContain(`${BASE_URL}/noticias/${slug}`)

    await api(`/news/${json.doc.id}`, { method: 'PATCH', body: { _status: 'draft' } })
    expect((await feed()).xml).not.toContain(heading)
  })

  it('is linked from the home page for feed readers to find', async () => {
    const html = await (await fetch(BASE_URL, { cache: 'no-store' })).text()

    expect(html).toContain('application/rss+xml')
    expect(html).toContain('/feed.xml')
  })
})
