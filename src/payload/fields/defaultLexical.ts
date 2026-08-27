// import type { TextFieldSingleValidation } from 'payload'
import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
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
      enabledCollections: [COLLECTION_SLUGS.News, COLLECTION_SLUGS.NotarialActs],
    }),
  ],
})
