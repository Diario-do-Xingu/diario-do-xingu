import type { CollectionConfig } from 'payload'

import { COLLECTION_GROUP } from '@/constants'
import { anyone } from '@/payload/access/anyone'

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
  },
  fields: [],
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
