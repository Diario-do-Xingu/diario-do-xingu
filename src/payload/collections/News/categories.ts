import { COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { slugField } from '@/payload/fields/slug'
import type { CollectionConfig } from 'payload'

export const NewsCategories: CollectionConfig = {
  slug: COLLECTION_SLUGS.NewsCategories,
  labels: {
    plural: 'Categorias',
    singular: 'Categoria',
  },
  access: {
    read: anyone,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome da categoria',
      admin: {
        description: 'Não é possível criar uma categoria que já existe',
      },
      required: true,
    },
    ...slugField('name'),
  ],
}
