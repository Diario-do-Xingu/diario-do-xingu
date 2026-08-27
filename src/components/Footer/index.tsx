import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faCoffee, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import defaultLogo from '@/assets/images/default-logo.png'
import { COLLECTION_SLUGS } from '@/constants'
import type { Media, SiteInfo } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSocialIcon } from '@/utilities/getSocialIcon'
import { ImageMedia } from '../Media/ImageMedia'

export async function Footer() {
  const siteInfo = (await getCachedGlobal(COLLECTION_SLUGS.SiteInfo, 1)()) as SiteInfo

  const hasLogo = 'logo' in siteInfo
  const logo = siteInfo.logo as Media | undefined
  const logoAlt = hasLogo ? logo?.alt || 'Logo Diário do Xingu' : ''

  return (
    <footer className="border-t-4 border-t-tertiary bg-primary py-3 pb-4 font-varela text-primary-foreground">
      <div className="container">
        <div className="mb-4 grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
          <Link href="/" className="justify-self-center lg:justify-self-start">
            {logo ? (
              <ImageMedia priority alt={logoAlt} imgClassName={'w-[200px]'} resource={logo} />
            ) : (
              <ImageMedia priority alt={logoAlt} imgClassName={'w-[200px]'} src={defaultLogo} />
            )}
          </Link>

          <div className="flex flex-col items-center justify-self-center tracking-wide lg:items-start lg:justify-self-center">
            {siteInfo.contacts?.email && (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 size-5" />
                {siteInfo.contacts.email}
              </span>
            )}
            {siteInfo.contacts?.phone?.value && (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faWhatsapp} className="mr-2 size-5" />
                {siteInfo.contacts.phone.value}
              </span>
            )}
          </div>

          <div className="flex gap-2 justify-self-center lg:justify-self-end">
            {siteInfo.socials?.map((social, i) => (
              <a
                key={i}
                href={social.link}
                target="_blank"
                className="grid place-items-center rounded-full bg-white/20 p-2 transition-transform hover:scale-[110%]"
                rel="noopener"
              >
                <FontAwesomeIcon icon={getSocialIcon(social.type)} className="size-7" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs tracking-wide">
            © {new Date().getFullYear()} Diário do Xingu - Todos os direitos reservados
          </span>
          <span className="text-xs tracking-wide">
            Developed with <FontAwesomeIcon icon={faCoffee} className="inline size-4" /> by{' '}
            <b className="font-globo">vkav labs</b>
          </span>
        </div>
      </div>
    </footer>
  )
}
