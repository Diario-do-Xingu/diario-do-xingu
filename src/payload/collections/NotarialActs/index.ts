import type { CollectionConfig } from 'payload'
import { v4 as uuidV4 } from 'uuid'
import { changeFilename } from './hooks/changeFilename'
import { revalidateDelete, revalidateNotarialActs } from './hooks/revalidateNotarialActs'

import { slugField } from '@/payload/fields/slug'
import { authenticatedOrPublished } from '@/payload/access/authenticatedOrPublished'
import { COLLECTION_SLUGS } from '@/constants'
import { env } from '@/env'

export const NotarialActs: CollectionConfig = {
  slug: COLLECTION_SLUGS.NotarialActs,
  labels: {
    singular: 'Ato Notarial',
    plural: 'Atos Notariais',
  },
  access: {
    read: authenticatedOrPublished,
  },

  admin: {
    defaultColumns: ['key', 'heading', 'publishedAt', '_status'],
    useAsTitle: 'heading',
  },
  upload: {
    // staticDir: 'public/notarial-acts',
    bulkUpload: false,
    displayPreview: false,
    pasteURL: false,
    filesRequiredOnCreate: false,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Texto',
      required: true,
    },
    {
      name: 'publishedAt',
      label: 'Publicado em',
      type: 'date',

      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Data que será mostrado em tela',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'key',
      type: 'text',
      label: 'Chave',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Chave será criada automaticamente',
      },
    },

    ...slugField('key', {
      slugOverrides: {
        unique: true,
        admin: {
          condition: () => !env.NEXT_PUBLIC_IS_LIVE,
        },
      },
    }),
  ],
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if (operation !== 'create') return

        if (!req.data) return
        if (req.data.key) return
        req.data.key = uuidV4().split('-').join('')
        req.data.slug = req.data.key
      },
      changeFilename,
    ],
    afterChange: [revalidateNotarialActs],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 5,
  },
}
