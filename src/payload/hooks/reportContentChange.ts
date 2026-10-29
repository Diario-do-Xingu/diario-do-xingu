import * as Sentry from '@sentry/nextjs'
import type { CollectionAfterChangeHook } from 'payload'

export const CONTENT_CHANGE_SPAN_PREFIX = 'content change:'

type TrackedCollection = 'news' | 'notarial-acts'

/**
 * Records successful editor changes as standalone traces for exact dashboard counts.
 */
export const reportContentChange = (collection: TrackedCollection): CollectionAfterChangeHook => {
  const afterChange: CollectionAfterChangeHook = ({ doc, operation, req }) => {
    if (!req.user || (collection === 'notarial-acts' && operation !== 'create')) return doc

    const change = operation === 'create' ? 'created' : 'updated'
    const name = `${CONTENT_CHANGE_SPAN_PREFIX} ${collection} ${change}`

    Sentry.startNewTrace(() => {
      Sentry.startSpan(
        {
          name,
          op: 'payload.content_change',
          attributes: { collection, operation },
        },
        () => {},
      )
    })

    return doc
  }

  return afterChange
}
