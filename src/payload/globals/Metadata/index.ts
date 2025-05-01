import type { GlobalConfig } from 'payload'
import { revalidateMetadata } from './hooks/revalidateMetadata'
import { COLLECTION_SLUGS } from '@/constants'

export const SiteMetadata: GlobalConfig = {
  slug: COLLECTION_SLUGS.SiteMetadata,
  label: 'Site Metadata',
  access: {
    read: () => true,
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
