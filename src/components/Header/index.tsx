import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import defaultLogo from '@/assets/images/default-logo.png'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import type { Media, SiteInfo } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSocialIcon } from '@/utilities/getSocialIcon'
import { cn } from '@/utilities/ui'
import { ImageMedia } from '../Media/ImageMedia'
import { DisplayDate } from './DisplayDate'
import { Stocks } from './Stocks'

const colors = ['text-primary', 'text-secondary', 'text-tertiary', 'text-accent']
const links: { label: string; link: string; color?: string }[] = [
  {
    label: 'home',
    link: '/',
  },
  {
    label: 'editorias',
    link: `/${COLLECTION_URL_PATHS.News}`,
  },
  {
    label: 'publicações legais',
    link: `/${COLLECTION_URL_PATHS.NotarialActs}`,
  },
  {
    label: 'edições digitais',
    link: `/${COLLECTION_URL_PATHS.DigitalEditions}`,
  },
  {
    label: 'tabela brasileirão',
    link: '/tabela-brasileirao',
    color: 'text-red-500',
  },
]

export async function Header() {
  const siteInfo = (await getCachedGlobal(COLLECTION_SLUGS.SiteInfo, 1)()) as SiteInfo

  const hasLogo = 'logo' in siteInfo
  const logo = siteInfo.logo as Media | undefined
  const logoAlt = hasLogo ? logo?.alt || 'Logo Diário do Xingu' : ''

  return (
    <header className="sticky top-0 z-50 bg-primary">
      <div className="relative w-full bg-white">
        <div className="container flex gap-4 overflow-auto">
          {links.map((link, i) => (
            <Link
              href={link.link}
              key={i}
              className={cn(
                'whitespace-nowrap border-transparent border-y-4 border-b-transparent px-1 py-1 font-bold font-globo text-lg transition-colors hover:border-b-red-400',
                link.color ? link.color : colors[i % colors.length],
                'hover:border-b-current',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent"></div>
      </div>

      <div className="border-b-4 border-b-secondary">
        <div className="container grid grid-cols-2 items-center py-4 text-primary-foreground lg:grid-cols-3 lg:py-2">
          <span className="hidden justify-self-start text-sm lg:block">
            <DisplayDate />
          </span>

          <Link href="/" className="justify-self-start lg:justify-self-center">
            {logo ? (
              <ImageMedia priority alt={logoAlt} imgClassName={'w-[200px]'} resource={logo} />
            ) : (
              <ImageMedia priority alt={logoAlt} imgClassName={'w-[200px]'} src={defaultLogo} />
            )}
          </Link>

          <div className="flex gap-2 justify-self-end">
            {siteInfo.socials?.map((social, i) => (
              <a
                key={i}
                href={social.link}
                target="_blank"
                className="grid place-items-center rounded-full bg-white/20 p-2 transition-transform hover:scale-[110%]"
                data-umami-event={`Abrir ${social.type} Diário do Xingu`}
                rel="noopener"
              >
                <FontAwesomeIcon icon={getSocialIcon(social.type)} className="size-7" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <Stocks />
    </header>
  )
}
