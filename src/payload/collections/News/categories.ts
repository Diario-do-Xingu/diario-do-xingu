import type { CollectionConfig } from 'payload'
import { COLLECTION_GROUP, COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { authenticated } from '@/payload/access/authenticated'
import { slugField } from '@/payload/fields/slug'
import { capPublicLimit } from '@/payload/hooks/capPublicLimit'

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
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome da categoria',
      admin: {
        description: 'Não é possível criar uma categoria que já existe',
      },
      required: true,
      unique: true,
      hooks: {
        // Surrounding spaces produced near-duplicates such as "Educação " next to "Educação".
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim() : value)],
      },
    },
    ...slugField('name'),
  ],
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
    group: COLLECTION_GROUP.Articles,
  },
  hooks: {
    beforeOperation: [capPublicLimit],
  },
}
