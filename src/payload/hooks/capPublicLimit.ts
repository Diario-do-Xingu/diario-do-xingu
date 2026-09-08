import type { CollectionBeforeOperationHook } from 'payload'

/** Largest page a REST caller may ask for. */
export const PUBLIC_MAX_LIMIT = 100

/**
 * Payload 3 has no `maxLimit`, so REST callers can request every document at once
 * (`limit=5000`, `limit=0` or `pagination=false` without a limit). This clamps those on
 * read operations that arrive through REST or GraphQL and leaves everything else as is:
 * a request without a limit keeps Payload's default page size, and the site's own Local
 * API queries are never touched.
 */
export const capPublicLimit: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation !== 'read' || req.payloadAPI === 'local') return args
  if (!('limit' in args)) return args

  const limit = typeof args.limit === 'number' ? args.limit : undefined
  const unbounded = limit === undefined ? args.pagination === false : limit <= 0
  if (unbounded || (limit !== undefined && limit > PUBLIC_MAX_LIMIT)) {
    return { ...args, limit: PUBLIC_MAX_LIMIT, pagination: true }
  }

  return args
}
