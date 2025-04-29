import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { SiteInfo } from '@/payload-types'
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

type Socials = NonNullable<SiteInfo['socials']>[number]['type']

const socialIconMapper: Record<Socials, IconDefinition> = {
  facebook: faFacebook,
  instagram: faInstagram,
  whatsapp: faWhatsapp,
}

export function getSocialIcon(social: Socials) {
  return socialIconMapper[social]
}
