import type { CollectionConfig } from 'payload'
import { COLLECTION_GROUP } from '@/constants'
import { admins } from '../access/admins'
import { authenticated } from '../access/authenticated'
import { checkRole } from './Users/checkRole'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    plural: 'Usuários',
    singular: 'Usuário',
  },
  admin: {
    useAsTitle: 'email',
    group: COLLECTION_GROUP.Configuration,
  },
  access: {
    read: authenticated,
    create: admins,
    delete: admins,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['admin'], user)) {
        return true
      }
      return {
        id: {
          equals: user.id,
        },
      }
    },
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      type: 'text',
      name: 'fullname',
      label: 'Nome completo',
    },
    {
      name: 'roles',
      label: 'Função',
      access: {
        create: admins,
        read: admins,
        update: admins,
      },
      required: true,
      defaultValue: ['editor'],
      hasMany: true,
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'editor',
          value: 'editor',
        },
      ],
      type: 'select',
    },
  ],
}
