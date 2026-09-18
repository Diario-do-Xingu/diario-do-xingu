import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  labels: {
    plural: 'Arquivos',
    singular: 'Arquivo',
  },
  fields: [
    {
      name: 'media',
      label: 'Arquivo',
      type: 'upload',
      relationTo: 'article-media',
      required: true,
    },
    {
      name: 'caption',
      label: 'Legenda',
      type: 'text',
    },
  ],
}
