import { getCachedGlobal } from '@/utilities/getGlobals'
import { ImageMedia } from '../Media/ImageMedia'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { getSocialIcon } from '@/utilities/getSocialIcon'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { SiteInfo } from '@/payload-types'
import { COLLECTION_SLUGS } from '@/constants'

export async function Footer() {
  const siteInfo = (await getCachedGlobal(COLLECTION_SLUGS.SiteInfo, 1)()) as SiteInfo

  return (
    <footer className="font-varela mt-8 border-t-4 border-t-tertiary bg-primary py-2 text-primary-foreground">
      <div className="container">
        <div className="mb-4 grid grid-cols-1 items-center lg:grid-cols-3">
          <Link href="/" className="">
            <ImageMedia resource={siteInfo.logo} imgClassName="w-[200px]" />
          </Link>

          <div className="flex flex-col justify-self-center tracking-wide">
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

          <div className="flex gap-2 justify-self-end">
            {siteInfo.socials?.map((social, i) => (
              <a
                key={i}
                href={social.link}
                target="_blank"
                className="rounded-full bg-white/20 p-2 transition-all hover:scale-[110%]"
              >
                <FontAwesomeIcon icon={getSocialIcon(social.type)} className="size-7" />
              </a>
            ))}
          </div>
        </div>

        <span className="text-xs tracking-wide">
          © {new Date().getFullYear()} Diário do Xingu - Todos os direitos reservados
        </span>
      </div>
    </footer>
  )
}
