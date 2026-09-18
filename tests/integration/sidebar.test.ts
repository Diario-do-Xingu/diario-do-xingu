import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { api, page } from './client'
import { articleFixtures, newsBody } from './fixtures'

/**
 * The sidebar's queries are cached and shared by every page, so the thing worth proving is that
 * an editor's publish still busts them rather than waiting out the window.
 */
type NewsDoc = { id: string }

let fixtures: Awaited<ReturnType<typeof articleFixtures>>
const created: string[] = []

const publishHighlighted = async (heading: string, slug: string) => {
  const { json } = await api<{ doc?: NewsDoc }>('/news', {
    method: 'POST',
    body: newsBody(fixtures, {
      _status: 'published',
      slug,
      heading,
      showInHighlights: true,
      publishedAt: new Date().toISOString(),
    }),
  })
  if (!json.doc) throw new Error('Could not create the highlighted article')
  created.push(json.doc.id)
  return json.doc
}

beforeAll(async () => {
  fixtures = await articleFixtures()
})

afterAll(async () => {
  for (const id of created) await api(`/news/${id}`, { method: 'DELETE' })
})

describe('sidebar', () => {
  it('shows a newly highlighted article without waiting for the cache window', async () => {
    const heading = `Destaque ${Date.now()}`
    await publishHighlighted(heading, `destaque-${Date.now()}`)

    const { status, html } = await page('/noticias')

    expect(status).toBe(200)
    expect(html).toContain('Destaques')
    expect(html).toContain(heading)
  })

  it('drops it again when it is unpublished', async () => {
    const heading = `Retirado ${Date.now()}`
    const doc = await publishHighlighted(heading, `retirado-${Date.now()}`)
    expect((await page('/noticias')).html).toContain(heading)

    await api(`/news/${doc.id}`, { method: 'PATCH', body: { _status: 'draft' } })

    expect((await page('/noticias')).html).not.toContain(heading)
  })
})
