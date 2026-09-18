import { FacebookIcon, InstagramIcon, WhatsappIcon } from '@/components/icons'
import type { SiteInfo } from '@/payload-types'

type Socials = NonNullable<SiteInfo['socials']>[number]['type']

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsappIcon,
} satisfies Record<Socials, unknown>

/** The icon component for a social network, rendered by the caller so it can set its own size. */
export function getSocialIcon(social: Socials) {
  return socialIcons[social]
}
