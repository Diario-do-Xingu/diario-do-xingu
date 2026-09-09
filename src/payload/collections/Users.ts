import type { CollectionConfig } from 'payload'
import { COLLECTION_GROUP } from '@/constants'
import { env } from '@/env'
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
    // Payload's default lets any signed-in user clear another account's login lockout
    // (GHSA-jg8r-5jh2-v2xj); only admins should.
    unlock: admins,
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
  auth: {
    cookies: {
      // Payload defaults to a non-secure cookie; only local http development needs that.
      secure: env.NEXT_PUBLIC_SERVER_URL.startsWith('https://'),
      // Already Payload's default; pinned because it is what blocks cross-site POSTs with the cookie.
      sameSite: 'Lax',
    },
  },
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
