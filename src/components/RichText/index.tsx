// import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

import { MediaBlock } from '@/payload/blocks/MediaBlock/Component'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps>

const pathMapper: Record<string, string> = {
  [COLLECTION_SLUGS.News]: COLLECTION_URL_PATHS.News,
  [COLLECTION_SLUGS.NotarialActs]: COLLECTION_URL_PATHS.NotarialActs,
}

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug

  const path = pathMapper[relationTo]
  return path ? `/${path}/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    mediaBlock: ({ node }) => {
      return <MediaBlock {...node.fields} captionClassName="italic" />
    },
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: true,
          'max-w-none': !enableGutter,
          'md:prose-md prose mx-auto': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
