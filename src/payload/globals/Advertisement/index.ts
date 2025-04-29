import type { GlobalConfig } from 'payload'
import { revalidateAdvertisement } from './hooks/revalidateAdvertisement'
import { COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'

export const Advertisement: GlobalConfig = {
  slug: COLLECTION_SLUGS.Advertisement,
  label: 'Publicidade',
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'group',
      name: 'sideBarAdvertisement',
      label: 'Publicidade barra lateral',
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
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAdvertisement],
  },
}
