import * as Sentry from '@sentry/nextjs'
import type { CollectionAfterChangeHook } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reportContentChange } from './reportContentChange'

vi.mock('@sentry/nextjs', () => ({
  startNewTrace: vi.fn((callback: () => void) => callback()),
  startSpan: vi.fn(),
}))

type Doc = { id: string }

const request = (user: object | null = { id: 'editor-1' }) => ({ user })

const change = (
  hook: CollectionAfterChangeHook,
  operation: 'create' | 'update',
  user: object | null = { id: 'editor-1' },
) =>
  hook({
    doc: { id: '1' },
    operation,
    req: request(user),
  } as unknown as Parameters<CollectionAfterChangeHook<Doc>>[0])

beforeEach(() => {
  vi.clearAllMocks()
})

describe('reportContentChange', () => {
  it('records news creation and updates by an editor', async () => {
    const hook = reportContentChange('news') as CollectionAfterChangeHook<Doc>

    await change(hook, 'create')
    await change(hook, 'update')

    expect(Sentry.startNewTrace).toHaveBeenCalledTimes(2)
    expect(Sentry.startSpan).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: 'content change: news created',
        op: 'payload.content_change',
        attributes: { collection: 'news', operation: 'create' },
      }),
      expect.any(Function),
    )
    expect(Sentry.startSpan).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: 'content change: news updated',
        attributes: { collection: 'news', operation: 'update' },
      }),
      expect.any(Function),
    )
  })

  it('records new legal publications but not their later edits', async () => {
    const hook = reportContentChange('notarial-acts') as CollectionAfterChangeHook<Doc>

    await change(hook, 'create')
    await change(hook, 'update')

    expect(Sentry.startSpan).toHaveBeenCalledTimes(1)
    expect(Sentry.startSpan).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'content change: notarial-acts created',
        attributes: { collection: 'notarial-acts', operation: 'create' },
      }),
      expect.any(Function),
    )
  })

  it('does not count changes without an editor user', async () => {
    const hook = reportContentChange('news') as CollectionAfterChangeHook<Doc>

    await change(hook, 'update', null)

    expect(Sentry.startNewTrace).not.toHaveBeenCalled()
    expect(Sentry.startSpan).not.toHaveBeenCalled()
  })
})
