import type { GlobalConfig } from 'payload'
import { revalidateSiteInfo } from './hooks/revalidateSiteInfo'
import { COLLECTION_SLUGS } from '@/constants'

export const SiteInfo: GlobalConfig = {
  slug: COLLECTION_SLUGS.SiteInfo,
  label: 'Informações Gerais',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'contacts',
      label: 'Contatos',
      type: 'group',
      fields: [
        {
          type: 'group',
          name: 'phone',
          label: false,
          admin: {
            hideGutter: true,
          },

          fields: [
            {
              type: 'row',
              fields: [
                { label: 'Número de Telefone', name: 'value', type: 'text', required: false },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'isWhatsApp',
                  type: 'checkbox',
                  label: 'WhatsApp',
                  required: false,
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          name: 'email',
          label: 'E-mail',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'socials',
      label: 'Redes Sociais',
      type: 'array',
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/payload/globals/SiteInfo/SocialRowLabel#SocialRowLabel',
        },
      },
      fields: [
        {
          label: 'Nome',
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          label: 'Tipo',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Instagram',
              value: 'instagram',
            },
            {
              label: 'WhatsApp',
              value: 'whatsapp',
            },
            {
              label: 'Facebook',
              value: 'facebook',
            },
          ],
          hasMany: false,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteInfo],
  },
}
