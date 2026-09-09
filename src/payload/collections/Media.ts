import type { CollectionConfig } from 'payload'
import { COLLECTION_GROUP, IMAGE_UPLOAD_MIME_TYPES } from '@/constants'
import { capPublicLimit } from '@/payload/hooks/capPublicLimit'
import { anyone } from '../access/anyone'
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
    // Originals are capped at 1920px and kept in their own format (they feed og:image, and
    // WhatsApp/Facebook previews are unreliable with WebP). Generated sizes are WebP.
    resizeOptions: { width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true },
    imageSizes: [
      {
        name: 'thumbnail',
        fit: 'contain',
        height: 200,
        width: 200,
      },
      { name: 'card', width: 640, withoutEnlargement: true, formatOptions: { format: 'webp' } },
      { name: 'hero', width: 1280, withoutEnlargement: true, formatOptions: { format: 'webp' } },
    ],
    bulkUpload: false,
  },
  hooks: {
    beforeOperation: [capPublicLimit],
  },
}
