import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { COLLECTION_GROUP } from '@/constants'

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
  },
  fields: [
    {
      type: 'text',
      name: 'alt',
    },
  ],
  upload: {
    pasteURL: false,
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
