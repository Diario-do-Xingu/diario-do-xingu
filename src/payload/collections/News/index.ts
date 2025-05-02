import { ARCHIVE_LIMIT, COLLECTION_SLUGS } from '@/constants'
import { CollectionConfig } from 'payload'
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
import { revalidateDelete, revalidateNews } from './hooks/revalidateNews'

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
    },
    {
      name: 'highligh',
      type: 'text',
      label: 'Chamada',
      required: true,
      admin: {
        description: 'Tag de chamada da notícia',
      },
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
                  label: 'Arquivo',
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
      type: 'checkbox',
      name: 'showInHighlights',
      label: 'Mostrar artigo nos destaques',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: `Mostra as últimas ${ARCHIVE_LIMIT.Highlights}`,
      },
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
      type: 'number',
      name: 'readCount',
      label: 'Contador de Visita',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Conta automaticamente o numero de vezes visitado por mais de 5 segundos.',
      },
    },
    ...slugField('heading', {
      slugOverrides: {
        unique: true,
        index: true,
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateNews],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },
}
