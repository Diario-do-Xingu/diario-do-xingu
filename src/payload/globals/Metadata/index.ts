import type { GlobalConfig } from 'payload'
import { COLLECTION_GROUP, COLLECTION_SLUGS } from '@/constants'
import { anyone } from '@/payload/access/anyone'
import { revalidateMetadata } from './hooks/revalidateMetadata'

export const SiteMetadata: GlobalConfig = {
  slug: COLLECTION_SLUGS.SiteMetadata,
  label: 'Site Metadata',
  access: {
    read: anyone,
  },
  admin: {
    group: COLLECTION_GROUP.Configuration,
  },
  fields: [
    {
      name: 'cardShareImage',
      label: 'Imagem de compartilhamento',
      admin: {
        description: 'Image que aparece no card quando compartilha link',
      },
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'text',
      name: 'siteName',
      label: 'Nome do site',
    },
    {
      type: 'text',
      name: 'siteTitle',
      label: 'Título do site',
    },
    {
      type: 'text',
      name: 'siteDescription',
      label: 'Descrição do site',
    },
  ],
  hooks: {
    afterChange: [revalidateMetadata],
  },
}
