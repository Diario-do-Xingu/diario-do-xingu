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
  fields: [],
  upload: {
    staticDir: 'public/media',
  },
}
