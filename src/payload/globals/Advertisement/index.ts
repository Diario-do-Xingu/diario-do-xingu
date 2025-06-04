import type { GlobalConfig } from 'payload'
import { revalidateAdvertisement } from './hooks/revalidateAdvertisement'
import { COLLECTION_GROUP, COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { AdvertisementBlock } from '@/payload/blocks/advertisement/advertisement-block'

export const AdType = {
  FirstSideAdsBanner: 'firstSideAdsBanner',
  SecondSideAdsBanner: 'secondSideAdsBanner',
  TopAdsBanner: 'topAdsBanner',
} as const

export const Advertisement: GlobalConfig = {
  slug: COLLECTION_SLUGS.Advertisement,
  label: 'Publicidade',
  access: {
    read: anyone,
  },
  admin: {
    group: COLLECTION_GROUP.Configuration,
  },
  fields: [
    {
      type: 'group',
      name: 'sideBarAdvertisement',
      label: 'Publicidade barra lateral',
      admin: {
        hidden: true,
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
        },
      ],
    },
    {
      name: AdType.TopAdsBanner,
      type: 'blocks',
      label: 'Top Banner',
      admin: {
        description: 'Melhor dimensão da image: largura 800px; altura 150px',
      },
      // minRows,
      maxRows: 1,
      blocks: [AdvertisementBlock],
    },
    {
      name: AdType.FirstSideAdsBanner,
      type: 'blocks',
      label: 'Primeiro Banner de Publi',
      // minRows,
      maxRows: 1,
      blocks: [AdvertisementBlock],
    },
    {
      name: AdType.SecondSideAdsBanner,
      type: 'blocks',
      label: 'Segundo Banner de Publi',
      // minRows,
      maxRows: 1,
      blocks: [AdvertisementBlock],
    },
  ],
  hooks: {
    afterChange: [revalidateAdvertisement],
  },
}
