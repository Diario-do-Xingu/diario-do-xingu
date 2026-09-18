import { COLLECTION_GROUP, COLLECTION_SLUGS } from '@/constants'
import { imageUploadCollection, THUMBNAIL_SIZE } from '@/payload/collections/imageUploadCollection'

export const DigitalEditionMedia = imageUploadCollection({
  slug: COLLECTION_SLUGS.DigitalEditionThumbs,
  labels: {
    plural: 'Thumbs das Edições Digitais',
    singular: 'Thumb da Edição Digital',
  },
  group: COLLECTION_GROUP.DigitalEditions,
  // A cover of the printed edition, shown at 144px in a square: one 500px original on white, and
  // no crop to focus, so none of the larger sizes the other two generate are of any use.
  upload: {
    focalPoint: false,
    resizeOptions: {
      fit: 'contain',
      height: 500,
      width: 500,
      background: { r: 255, g: 255, b: 255 },
    },
    imageSizes: [THUMBNAIL_SIZE],
  },
})
