import type { CollectionBeforeOperationHook } from 'payload'

export const changeFilename: CollectionBeforeOperationHook = ({ req, operation }) => {
  if ((operation !== 'create' && operation !== 'update') || !req.file || !req.data) return

  const key = req.data.key
  const fileExtension = req.file.name.split('.')[1]
  const filename = [`na-${key}`, fileExtension].join('.')

  req.file.name = filename
}
