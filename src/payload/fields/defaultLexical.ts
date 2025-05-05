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
      enabledCollections: [COLLECTION_SLUGS.News, COLLECTION_SLUGS.NotarialActs],
    }),
  ],
})
