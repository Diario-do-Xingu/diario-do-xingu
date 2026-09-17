import type { FieldHook } from 'payload'
import { describe, expect, it } from 'vitest'
import { populatePublishedAt } from './populatePublishedAt'

const run = (siblingData: { _status?: string }, value?: unknown) =>
  populatePublishedAt({ siblingData, value } as unknown as Parameters<FieldHook>[0])

describe('populatePublishedAt', () => {
  it('stamps the current date when a document is published without one', () => {
    expect(run({ _status: 'published' })).toBeInstanceOf(Date)
  })

  it('keeps a date the editor set by hand', () => {
    const chosen = '2026-01-15T12:00:00.000Z'
    expect(run({ _status: 'published' }, chosen)).toBe(chosen)
  })

  it('leaves drafts empty', () => {
    expect(run({ _status: 'draft' })).toBeUndefined()
  })
})
