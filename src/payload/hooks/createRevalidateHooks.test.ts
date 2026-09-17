import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRevalidateHooks } from './createRevalidateHooks'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))

type Doc = { id: string; slug?: string | null; _status?: 'draft' | 'published' | null }

const { afterChange, afterDelete } = createRevalidateHooks<Doc>({
  urlPath: 'noticias',
  sitemapTag: 'sitemap-news',
})

const payload = { logger: { info: vi.fn(), warn: vi.fn() } }

const change = (doc: Doc, previousDoc?: Doc, context: Record<string, unknown> = {}) =>
  (afterChange as CollectionAfterChangeHook<Doc>)({
    doc,
    previousDoc,
    req: { payload, context },
  } as unknown as Parameters<CollectionAfterChangeHook<Doc>>[0])

const remove = (doc: Doc) =>
  (afterDelete as CollectionAfterDeleteHook<Doc>)({
    doc,
    req: { payload, context: {} },
  } as unknown as Parameters<CollectionAfterDeleteHook<Doc>>[0])

/** Paths passed to Next, in call order. */
const revalidated = () => vi.mocked(revalidatePath).mock.calls.map(([path]) => path)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('afterChange', () => {
  it('revalidates the list routes and the document when it is published', async () => {
    await change({ id: '1', slug: 'chuva-no-xingu', _status: 'published' })

    expect(revalidated()).toEqual(['/', '/noticias', '/noticias/chuva-no-xingu'])
    expect(revalidateTag).toHaveBeenCalledWith('sitemap-news', { expire: 0 })
  })

  it('also revalidates the old URL when a published document changes slug', async () => {
    await change(
      { id: '1', slug: 'titulo-novo', _status: 'published' },
      { id: '1', slug: 'titulo-antigo', _status: 'published' },
    )

    expect(revalidated()).toContain('/noticias/titulo-novo')
    expect(revalidated()).toContain('/noticias/titulo-antigo')
  })

  it('revalidates the old URL when a document is unpublished', async () => {
    await change(
      { id: '1', slug: 'saiu-do-ar', _status: 'draft' },
      { id: '1', slug: 'saiu-do-ar', _status: 'published' },
    )

    expect(revalidated()).toEqual(['/', '/noticias', '/noticias/saiu-do-ar'])
  })

  it('does nothing for a draft that was never published', async () => {
    await change({ id: '1', slug: 'rascunho', _status: 'draft' })

    expect(revalidatePath).not.toHaveBeenCalled()
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('respects context.disableRevalidate', async () => {
    await change({ id: '1', slug: 'em-massa', _status: 'published' }, undefined, {
      disableRevalidate: true,
    })

    expect(revalidatePath).not.toHaveBeenCalled()
  })
})

describe('afterDelete', () => {
  it('revalidates the list routes and the deleted URL', async () => {
    await remove({ id: '1', slug: 'apagada', _status: 'published' })

    expect(revalidated()).toEqual(['/', '/noticias', '/noticias/apagada'])
    expect(revalidateTag).toHaveBeenCalledWith('sitemap-news', { expire: 0 })
  })
})
