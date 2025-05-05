import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    plural: 'Arquivos',
    singular: 'Arquivo',
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
