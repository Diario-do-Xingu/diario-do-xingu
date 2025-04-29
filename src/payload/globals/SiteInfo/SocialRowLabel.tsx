'use client'
import { SiteInfo } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const SocialRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<SiteInfo['socials']>[number]>()

  const label = data?.data?.label ? `${data?.data?.label}` : 'Rede social'

  return <div>{label}</div>
}
