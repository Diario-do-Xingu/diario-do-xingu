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
      required: true,
    },
    {
      type: 'text',
      name: 'cardShareImageAlt',
      label: 'Descrição da imagem de compartilhamento',
      required: false,
    },
    {
      type: 'text',
      name: 'siteName',
      label: 'Nome do site',
      required: true,
    },
    {
      type: 'text',
      name: 'siteTitle',
      label: 'Título do site',
      required: true,
    },
    {
      type: 'text',
      name: 'siteDescription',
      label: 'Descrição do site',
      required: true,
    },

    // {
    //   name: 'contacts',
    //   label: 'Contatos',
    //   type: 'group',
    //   fields: [
    //     {
    //       type: 'group',
    //       name: 'phone',
    //       label: false,
    //       admin: {
    //         hideGutter: true,
    //       },

    //       fields: [
    //         {
    //           type: 'row',
    //           fields: [
    //             { label: 'Número de Telefone', name: 'value', type: 'text', required: false },
    //           ],
    //         },
    //         {
    //           type: 'row',
    //           fields: [
    //             {
    //               name: 'isWhatsApp',
    //               type: 'checkbox',
    //               label: 'WhatsApp',
    //               required: false,
    //               defaultValue: false,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       name: 'email',
    //       label: 'E-mail',
    //       type: 'text',
    //       required: false,
    //     },
    //   ],
    // },
    // {
    //   name: 'socials',
    //   label: 'Redes Sociais',
    //   type: 'array',
    //   admin: {
    //     initCollapsed: true,
    //     components: {
    //       RowLabel: '@/payload/globals/SiteInfo/SocialRowLabel#SocialRowLabel',
    //     },
    //   },
    //   fields: [
    //     {
    //       label: 'Nome',
    //       name: 'label',
    //       type: 'text',
    //       required: true,
    //     },
    //     {
    //       name: 'type',
    //       label: 'Tipo',
    //       type: 'select',
    //       required: true,
    //       options: [
    //         {
    //           label: 'Instagram',
    //           value: 'instagram',
    //         },
    //         {
    //           label: 'WhatsApp',
    //           value: 'whatsapp',
    //         },
    //         {
    //           label: 'Facebook',
    //           value: 'facebook',
    //         },
    //       ],
    //       hasMany: false,
    //     },
    //     {
    //       name: 'link',
    //       type: 'text',
    //       required: true,
    //     },
    //   ],
    // },
  ],
  hooks: {
    afterChange: [revalidateMetadata],
  },
}
