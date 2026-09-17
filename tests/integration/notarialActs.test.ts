import { afterAll, describe, expect, it } from 'vitest'
import { api, page } from './client'
import { samplePdf } from './fixtures'

type ActDoc = {
  id: string
  key?: string | null
  slug?: string | null
  filename?: string | null
  publishedAt?: string | null
}

const created: string[] = []

/** Creates an act the way the admin panel does: one multipart request carrying the file. */
const createAct = async (over: Record<string, unknown> = {}, filename = 'edital.final.v2.pdf') => {
  const form = new FormData()
  form.append('file', new Blob([samplePdf()], { type: 'application/pdf' }), filename)
  form.append(
    '_payload',
    JSON.stringify({ heading: 'Edital de integração', content: 'Texto do ato', ...over }),
  )

  const { json, status } = await api<{ doc?: ActDoc }>('/notarial-acts', {
    method: 'POST',
    body: form,
  })
  if (!json.doc) throw new Error(`Could not create the act (status ${status})`)
  created.push(json.doc.id)
  return json.doc
}

afterAll(async () => {
  for (const id of created) await api(`/notarial-acts/${id}`, { method: 'DELETE' })
})

describe('notarial acts', () => {
  it('generates the key, mirrors it into the slug and renames the upload after it', async () => {
    const act = await createAct({ _status: 'draft' })

    expect(act.key).toMatch(/^[0-9a-f]{32}$/)
    expect(act.slug).toBe(act.key)
    // Only the last extension survives, so a multi-dot upload is not mangled.
    expect(act.filename).toBe(`na-${act.key}.pdf`)
  })

  it('stamps publishedAt when the act is published, and serves it at its key', async () => {
    const act = await createAct({ _status: 'draft' })
    expect(act.publishedAt ?? null).toBeNull()

    const published = (
      await api<{ doc?: ActDoc }>(`/notarial-acts/${act.id}`, {
        method: 'PATCH',
        body: { _status: 'published' },
      })
    ).json.doc
    expect(Date.parse(published?.publishedAt ?? '')).toBeCloseTo(Date.now(), -5)

    expect((await page(`/publicacoes-legais/${act.key}`)).status).toBe(200)

    await api(`/notarial-acts/${act.id}`, { method: 'PATCH', body: { _status: 'draft' } })
    expect((await page(`/publicacoes-legais/${act.key}`)).status).toBe(404)
  })
})
