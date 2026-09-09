import type { CollectionConfig } from 'payload'
import { COLLECTION_GROUP, IMAGE_UPLOAD_MIME_TYPES } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { capPublicLimit } from '@/payload/hooks/capPublicLimit'

export const ArticleMedia: CollectionConfig = {
  slug: 'article-media',
  labels: {
    plural: 'Arquivos de Noticia',
    singular: 'Arquivo de Noticia',
  },
  admin: {
    group: COLLECTION_GROUP.Articles,
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
