import type { CollectionConfig } from 'payload'
import { IMAGE_UPLOAD_MIME_TYPES } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { capPublicLimit } from '@/payload/hooks/capPublicLimit'

/** The admin thumbnail every upload collection generates, whatever else it does with the image. */
export const THUMBNAIL_SIZE = {
  name: 'thumbnail',
  fit: 'contain',
  height: 200,
  width: 200,
} as const

type UploadOptions = Extract<CollectionConfig['upload'], object>

type ImageUploadCollectionArgs = {
  slug: string
  labels: { singular: string; plural: string }
  /** Sidebar group in the admin. */
  group: string
  /**
   * Merged over the defaults below, shallowly - `imageSizes` replaces the list rather than adding
   * to it, so a collection that overrides it drops `card` and `hero` with it.
   */
  upload?: Partial<UploadOptions>
}

/**
 * The three image collections differ only in what they are for and how large they are kept, so
 * they are built from here: public to read, editors to write, capped in size, and carrying the
 * `alt` text the frontend reads off the upload when the page has nothing better to say.
 */
export function imageUploadCollection({
  slug,
  labels,
  group,
  upload,
}: ImageUploadCollectionArgs): CollectionConfig {
  return {
    slug,
    labels,
    admin: { group },
    access: {
      read: anyone,
      create: authenticated,
      update: authenticated,
      delete: authenticated,
    },
    fields: [
      {
        name: 'alt',
        type: 'text',
        label: 'Texto alternativo',
        admin: {
          description: 'Descreve a imagem para leitores de tela e aparece se ela não carregar.',
        },
      },
    ],
    upload: {
      pasteURL: false,
      bulkUpload: false,
      mimeTypes: IMAGE_UPLOAD_MIME_TYPES,
      // Originals are capped at 1920px and kept in their own format (they feed og:image, and
      // WhatsApp/Facebook previews are unreliable with WebP). Generated sizes are WebP.
      resizeOptions: { width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true },
      imageSizes: [
        THUMBNAIL_SIZE,
        { name: 'card', width: 640, withoutEnlargement: true, formatOptions: { format: 'webp' } },
        { name: 'hero', width: 1280, withoutEnlargement: true, formatOptions: { format: 'webp' } },
      ],
      ...upload,
    },
    hooks: {
      beforeOperation: [capPublicLimit],
    },
  }
}
