import type { FieldHook } from 'payload'

/**
 * Stamps `publishedAt` the first time a document goes live, so editors never have to set it
 * by hand. An explicit date always wins, and drafts stay empty until they are published.
 */
export const populatePublishedAt: FieldHook = ({ siblingData, value }) => {
  if (siblingData._status === 'published' && !value) return new Date()
  return value
}
