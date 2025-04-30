// import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
  AlignFeature,
  IndentFeature,
  StrikethroughFeature,
  // type LinkFields,
  SubscriptFeature,
  SuperscriptFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
} from '@payloadcms/richtext-lexical'
import { COLLECTION_SLUGS } from '@/constants'

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    BlockquoteFeature(),
    AlignFeature(),
    IndentFeature(),
    StrikethroughFeature(),
    LinkFeature({
      enabledCollections: [COLLECTION_SLUGS.News],
    }),
    // LinkFeature({
    //   enabledCollections: ['pages', 'posts'],
    //   fields: ({ defaultFields }) => {
    //     const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
    //       if ('name' in field && field.name === 'url') return false
    //       return true
    //     })

    //     return [
    //       ...defaultFieldsWithoutUrl,
    //       {
    //         name: 'url',
    //         type: 'text',
    //         admin: {
    //           condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
    //         },
    //         label: ({ t }) => t('fields:enterURL'),
    //         required: true,
    //         validate: ((value, options) => {
    //           if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
    //             return true // no validation needed, as no url should exist for internal links
    //           }
    //           return value ? true : 'URL is required'
    //         }) as TextFieldSingleValidation,
    //       },
    //     ]
    //   },
    // }),
  ],
})
