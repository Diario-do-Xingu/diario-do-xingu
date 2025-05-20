import { COLLECTION_GROUP, COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
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
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
    group: COLLECTION_GROUP.Articles,
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
