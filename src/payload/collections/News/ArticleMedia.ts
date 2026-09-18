import { COLLECTION_GROUP, COLLECTION_SLUGS } from '@/constants'
import { imageUploadCollection } from '@/payload/collections/imageUploadCollection'

export const ArticleMedia = imageUploadCollection({
  slug: COLLECTION_SLUGS.ArticleMedia,
  labels: {
    plural: 'Arquivos de Notícia',
    singular: 'Arquivo de Notícia',
  },
  group: COLLECTION_GROUP.Articles,
})
