import type { CollectionConfig } from 'payload'
import { COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'

import { authenticated } from '@/payload/access/authenticated'
import { slugField } from '@/payload/fields/slug'
import { revalidateDelete, revalidateDigitalEditions } from './hooks/revalidateDigitalEdition'

export const DigitalEditions: CollectionConfig = {
  slug: COLLECTION_SLUGS.DigitalEditions,
  labels: {
    singular: 'Edição Digital',
    plural: 'Edições Digitais',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['digital-edition-name'],
    useAsTitle: 'digital-edition-name',
    group: 'Edições Digitais',
  },
  upload: {
    bulkUpload: false,
    displayPreview: false,
    pasteURL: false,
    filesRequiredOnCreate: true,
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      type: 'upload',
      relationTo: COLLECTION_SLUGS.DigitalEditionThumbs,
      name: 'thumb',
      label: 'Imagem de Capa',
      required: true,
    },
    {
      name: 'digital-edition-name',
      type: 'text',
      label: 'Nome da Edição',
      required: true,
    },
    ...slugField('digital-edition-name'),
  ],

  hooks: {
    afterChange: [revalidateDigitalEditions],
    afterDelete: [revalidateDelete],
  },
}
