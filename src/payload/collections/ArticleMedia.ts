import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'

export const ArticleMedia: CollectionConfig = {
  slug: 'article-media',
  labels: {
    plural: 'Arquivos de Noticia',
    singular: 'Arquivo de Noticia',
  },
  access: {
    read: anyone,
  },
  fields: [
    // {
    //   type: 'text',
    //   name: 'alt',
    // },
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
