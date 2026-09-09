import type { Block } from 'payload'
import { validateUrl } from '@/payload/fields/validateUrl'

export const AdvertisementBlock: Block = {
  slug: 'advertisementBlock',
  interfaceName: 'AdvertisementBlock',
  labels: {
    plural: 'Publicidade',
    singular: 'Publicidades',
  },
  fields: [
    {
      name: 'image',
      label: 'Imagem',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'link',
      label: 'Link',
      type: 'text',
      validate: validateUrl,
    },
  ],
}
