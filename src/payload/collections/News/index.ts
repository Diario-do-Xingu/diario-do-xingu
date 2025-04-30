import { COLLECTION_SLUGS } from '@/constants'
import { CollectionConfig } from 'payload'
import { populatePublishedAt } from '../NotarialActs/hooks/populatePublishedAt'
import { slugField } from '@/payload/fields/slug'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { MediaBlock } from '@/payload/blocks/MediaBlock'
import { authenticatedOrPublished } from '@/payload/access/authenticatedOrPublished'

export const News: CollectionConfig = {
  slug: COLLECTION_SLUGS.News,
  labels: {
    singular: 'Notícia',
    plural: 'Notícias',
  },
  access: {
    read: authenticatedOrPublished,
  },

  admin: {
    useAsTitle: 'heading',
    defaultColumns: ['_status', 'heading', 'subheading', 'publishedAt'],
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'subheading',
      label: 'Sub Título',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Conteúdo',
          fields: [
            {
              type: 'group',
              name: 'heroImage',
              label: 'Imagem de capa',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: false,
                  required: true,
                  admin: {
                    description: 'Image do card da notícia',
                  },
                },
                {
                  name: 'description',
                  label: 'Descrição da imagem',
                  type: 'text',
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',

              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Texto da matéria',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Publicado em',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [populatePublishedAt],
      },
    },
    {
      name: 'authors',
      label: 'Autores',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: COLLECTION_SLUGS.Authors,
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'relationship',
      required: true,
      admin: {
        position: 'sidebar',
      },

      relationTo: COLLECTION_SLUGS.NewsCategories,
    },
    ...slugField('heading'),
  ],
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },
}
