'use client'
import { type RowLabelProps, useRowLabel } from '@payloadcms/ui'
import type { SiteInfo } from '@/payload-types'

export const SocialRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<SiteInfo['socials']>[number]>()

  const label = data?.data?.label ? `${data?.data?.label}` : 'Rede social'

  return <div>{label}</div>
}
