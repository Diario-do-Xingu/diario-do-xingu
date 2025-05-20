import { ARCHIVE_LIMIT, COLLECTION_GROUP, COLLECTION_SLUGS } from '@/constants'
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

import { authenticated } from '@/payload/access/authenticated'

export const News: CollectionConfig = {
  slug: COLLECTION_SLUGS.News,
  labels: {
    singular: 'Notícia',
    plural: 'Notícias',
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: COLLECTION_GROUP.Articles,
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
                  relationTo: 'article-media',
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
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
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
    afterRead: [
      // async ({ doc, req: { payload } }) => {
      //   if (doc?.authors && doc?.authors?.length > 0) {
      //     const authorDocs: Author[] = []
      //     for (const author of doc.authors) {
      //       try {
      //         const authorDoc = await payload.findByID({
      //           id: typeof author === 'object' ? author?.id : author,
      //           collection: COLLECTION_SLUGS.Authors,
      //           depth: 0,
      //         })
      //         if (authorDoc) {
      //           authorDocs.push(authorDoc)
      //         }
      //         if (authorDocs.length > 0) {
      //           doc.populatedAuthors = authorDocs.map((authorDoc) => ({
      //             name: authorDoc.name,
      //             id: authorDoc.id,
      //           }))
      //         }
      //       } catch {}
      //     }
      //   }
      //   return doc
      // },
    ],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 10,
  },
}
