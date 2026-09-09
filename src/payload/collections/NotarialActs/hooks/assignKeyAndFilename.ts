import path from 'node:path'
import { APIError, type CollectionBeforeOperationHook } from 'payload'
import { v4 as uuidV4 } from 'uuid'
import { COLLECTION_SLUGS } from '@/constants'

/**
 * Gives a new act its key (also used as the slug and the public URL) and names the uploaded
 * file after it. This has to be a beforeOperation hook: Payload processes the upload right
 * after it, and the filename cannot change later. It reads `args.data`, which both the REST
 * and the Local API populate (`req.data` is REST-only).
 */
export const assignKeyAndFilename: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return args

  const data = args.data as { key?: string; slug?: string } | undefined

  if (operation === 'create' && data && !data.key) {
    data.key = uuidV4().replaceAll('-', '')
    data.slug = data.key
  }

  if (!req.file) return args

  if (operation === 'create') {
    if (data?.key) req.file.name = fileNameFor(data.key, req.file.name)
    return args
  }

  // A bulk update shares one file across every matched document; there is no key to name it after.
  const id = 'id' in args ? args.id : undefined
  if (typeof id !== 'string' && typeof id !== 'number') {
    throw new APIError('Envio de arquivo não é suportado em edição em massa', 400)
  }

  // The key is immutable, so the stored one is authoritative. The read stays inside the
  // request (and its transaction); a missing document is left for the operation's own 404.
  const doc = await req.payload.findByID({
    collection: COLLECTION_SLUGS.NotarialActs,
    id,
    depth: 0,
    select: { key: true },
    disableErrors: true,
    req,
  })
  if (doc?.key) {
    req.file.name = fileNameFor(doc.key, req.file.name)
    // The only file that can already carry this name is the document's own previous upload,
    // so replace it instead of letting Payload append a `-1` suffix.
    args.overwriteExistingFiles = true
  }
  // Acts created before keys existed keep the uploaded name; none are left in production.

  return args
}

const fileNameFor = (key: string, uploadedName: string) => `na-${key}${path.extname(uploadedName)}`
