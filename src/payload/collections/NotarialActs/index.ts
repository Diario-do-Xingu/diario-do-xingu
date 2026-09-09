import type { CollectionConfig } from 'payload'
import { COLLECTION_GROUP, COLLECTION_SLUGS, NOTARIAL_ACT_MIME_TYPES } from '@/constants'
import { env } from '@/env'
import { authenticated } from '@/payload/access/authenticated'
import { authenticatedOrPublished } from '@/payload/access/authenticatedOrPublished'
import { slugField } from '@/payload/fields/slug'
import { capPublicLimit } from '@/payload/hooks/capPublicLimit'
import { assignKeyAndFilename } from './hooks/assignKeyAndFilename'
import { revalidateDelete, revalidateNotarialActs } from './hooks/revalidateNotarialActs'

export const NotarialActs: CollectionConfig = {
  slug: COLLECTION_SLUGS.NotarialActs,
  // List pages filter on _status and sort by publishedAt; createdAt is the adapter's tiebreaker.
  indexes: [{ fields: ['_status', 'publishedAt', 'createdAt'] }],
  labels: {
    singular: 'Ato Notarial',
    plural: 'Atos Notariais',
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  admin: {
    defaultColumns: ['key', 'heading', 'publishedAt', '_status'],
    useAsTitle: 'heading',
    group: COLLECTION_GROUP.NotarialActs,
  },
  upload: {
    // staticDir: 'public/notarial-acts',
    mimeTypes: NOTARIAL_ACT_MIME_TYPES,
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
      index: true,
      unique: true,
      // The key names the file and the public URL, so it never changes after create.
      access: { update: () => false },
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
    beforeOperation: [capPublicLimit, assignKeyAndFilename],
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
