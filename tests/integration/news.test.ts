import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { api, page } from './client'
import { articleFixtures, newsBody } from './fixtures'

type NewsDoc = { id: string; slug?: string | null; publishedAt?: string | null }

const slug = `integracao-${Date.now()}`
let fixtures: Awaited<ReturnType<typeof articleFixtures>>
const created: string[] = []

const createNews = async (over: Record<string, unknown>) => {
  const { json, status } = await api<{ doc?: NewsDoc }>('/news', {
    method: 'POST',
    body: newsBody(fixtures, over),
  })
  if (!json.doc) throw new Error(`Could not create the article (status ${status})`)
  created.push(json.doc.id)
  return json.doc
}

const patchNews = async (id: string, body: Record<string, unknown>) =>
  (await api<{ doc?: NewsDoc }>(`/news/${id}`, { method: 'PATCH', body })).json.doc

beforeAll(async () => {
  fixtures = await articleFixtures()
})

afterAll(async () => {
  for (const id of created) await api(`/news/${id}`, { method: 'DELETE' })
})

describe('publishedAt', () => {
  it('is left empty on a draft and stamped when the article goes live', async () => {
    const draft = await createNews({ _status: 'draft', slug: `${slug}-rascunho` })
    expect(draft.publishedAt ?? null).toBeNull()

    const published = await patchNews(draft.id, { _status: 'published' })
    expect(Date.parse(published?.publishedAt ?? '')).toBeCloseTo(Date.now(), -5)
  })

  it('keeps a date the editor chose', async () => {
    const chosen = '2020-05-05T12:00:00.000Z'
    const article = await createNews({
      _status: 'published',
      slug: `${slug}-data`,
      publishedAt: chosen,
    })

    expect(article.publishedAt).toBe(chosen)
  })

  it('survives unpublishing', async () => {
    const article = await createNews({ _status: 'published', slug: `${slug}-volta` })
    const unpublished = await patchNews(article.id, { _status: 'draft' })

    expect(unpublished?.publishedAt).toBe(article.publishedAt)
  })
})

describe('revalidation', () => {
  it('publishes the article to its own URL and to the list pages', async () => {
    const heading = `Integração ${Date.now()}`
    await createNews({ _status: 'published', slug: `${slug}-publica`, heading })

    const detail = await page(`/noticias/${slug}-publica`)
    expect(detail.status).toBe(200)
    expect(detail.html).toContain(heading)
    expect((await page('/noticias')).html).toContain(heading)
    expect((await page('/')).html).toContain(heading)
  })

  it('refreshes the cached page when the article is edited', async () => {
    const article = await createNews({ _status: 'published', slug: `${slug}-edita` })
    const path = `/noticias/${slug}-edita`
    expect((await page(path)).status).toBe(200)

    const edited = `Editada ${Date.now()}`
    await patchNews(article.id, { heading: edited })

    expect((await page(path)).html).toContain(edited)
  })

  it('moves the page when the slug changes, and drops the old URL', async () => {
    const article = await createNews({ _status: 'published', slug: `${slug}-antigo` })

    // Fetch it first so the old URL is genuinely cached: without this the 404 below would
    // only mean "never rendered", which would pass even with revalidation switched off.
    expect((await page(`/noticias/${slug}-antigo`)).status).toBe(200)

    await patchNews(article.id, { slug: `${slug}-novo` })

    expect((await page(`/noticias/${slug}-novo`)).status).toBe(200)
    expect((await page(`/noticias/${slug}-antigo`)).status).toBe(404)
  })

  it('takes the page down when the article is unpublished, and again when deleted', async () => {
    const article = await createNews({ _status: 'published', slug: `${slug}-remove` })
    const path = `/noticias/${slug}-remove`
    expect((await page(path)).status).toBe(200)

    await patchNews(article.id, { _status: 'draft' })
    expect((await page(path)).status).toBe(404)

    await patchNews(article.id, { _status: 'published' })
    expect((await page(path)).status).toBe(200)

    await api(`/news/${article.id}`, { method: 'DELETE' })
    expect((await page(path)).status).toBe(404)
  })
})
