import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { getServerSideURL } from '@/utilities/getURL'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    plural: 'Arquivos',
    singular: 'Arquivo',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'text',
      name: 'alt',
    },
  ],
  upload: {
    staticDir: 'public/media',
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
    adminThumbnail: ({ doc }) => {
      // @ts-expect-error no worries
      return `${getServerSideURL()}/media/${doc.sizes?.thumbnail?.filename || doc.filename}`
    },
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        const serverURL = getServerSideURL()

        // Add base URL to main file
        doc.url = `${serverURL}/media/${doc.filename}`

        // Add base URL to each size
        if (doc.sizes) {
          Object.keys(doc.sizes).forEach((sizeKey) => {
            const size = doc.sizes[sizeKey]
            if (size?.width && size?.height) {
              size.url = `${serverURL}/media/${size.filename}`
            }
          })
        }

        return doc
      },
    ],
  },
}
