import { COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import type { CollectionConfig } from 'payload'

export const DigitalEditionMedia: CollectionConfig = {
  admin: {
    group: 'Edições Digitais',
  },
  slug: COLLECTION_SLUGS.DigitalEditionThumbs,
  labels: {
    plural: 'Thumbs das Edições Digitais',
    singular: 'Thumb da Edição Digital',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [],
  upload: {
    pasteURL: false,
    bulkUpload: false,
    mimeTypes: ['image/*'],
    focalPoint: false,
    imageSizes: [
      {
        name: 'thumbnail',
        fit: 'contain',
        height: 200,
        width: 200,
      },
    ],
  },
}
