'use client'
import { useRowLabel } from '@payloadcms/ui'
import type { SiteInfo } from '@/payload-types'

export function SocialRowLabel() {
  const data = useRowLabel<NonNullable<SiteInfo['socials']>[number]>()

  const label = data?.data?.label ? `${data?.data?.label}` : 'Rede social'

  return <div>{label}</div>
}
