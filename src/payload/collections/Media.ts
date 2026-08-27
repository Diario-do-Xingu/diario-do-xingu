import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { COLLECTION_GROUP, IMAGE_UPLOAD_MIME_TYPES } from '@/constants'
import { authenticated } from '../access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    plural: 'Arquivos Gerais',
    singular: 'Arquivo Geral',
  },
  admin: {
    group: COLLECTION_GROUP.Configuration,
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'text',
      name: 'alt',
    },
  ],
  upload: {
    pasteURL: false,
    mimeTypes: IMAGE_UPLOAD_MIME_TYPES,
    imageSizes: [
      {
        name: 'thumbnail',
        fit: 'contain',
        height: 200,
        width: 200,
      },
    ],
    bulkUpload: false,
  },
}
