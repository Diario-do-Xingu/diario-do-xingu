import { COLLECTION_GROUP, COLLECTION_SLUGS } from '@/constants'
import { imageUploadCollection } from '@/payload/collections/imageUploadCollection'

export const Media = imageUploadCollection({
  slug: COLLECTION_SLUGS.Media,
  labels: {
    plural: 'Arquivos Gerais',
    singular: 'Arquivo Geral',
  },
  group: COLLECTION_GROUP.Configuration,
})
