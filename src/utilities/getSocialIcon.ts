import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import type { SiteInfo } from '@/payload-types'

type Socials = NonNullable<SiteInfo['socials']>[number]['type']

const socialIconMapper: Record<Socials, IconDefinition> = {
  facebook: faFacebook,
  instagram: faInstagram,
  whatsapp: faWhatsapp,
}

export function getSocialIcon(social: Socials) {
  return socialIconMapper[social]
}
