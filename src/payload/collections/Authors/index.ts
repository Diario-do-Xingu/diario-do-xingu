import { COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: COLLECTION_SLUGS.Authors,
  access: {
    read: anyone,
  },
  labels: {
    plural: 'Autores',
    singular: 'Autor',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'placeOfWork'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
      unique: true,
      required: true,
      hooks: {
        beforeValidate: [
          // ({ value }) => {
          //   if (typeof value === 'string') {
          //     return value
          //       .toLowerCase()
          //       .split(' ')
          //       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          //       .join(' ')
          //   }
          //   return value
          // },
        ],
      },
    },
    // {
    //   name: 'placeOfWork',
    //   label: 'Empresa',
    //   type: 'text',
    //   admin: {
    //     description: 'Não obrigatório. ex: Diário do Xingu',
    //   },
    // },
  ],
}
