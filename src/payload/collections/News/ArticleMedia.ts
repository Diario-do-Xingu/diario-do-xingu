import type { CollectionConfig } from 'payload'

import { COLLECTION_GROUP, IMAGE_UPLOAD_MIME_TYPES } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'

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
