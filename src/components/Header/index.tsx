import { ImageMedia } from '@/components/Media/ImageMedia'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Link from 'next/link'
import { writingDate } from '@/utilities/formatDate'
import { cn } from '@/utilities/ui'
import { getSocialIcon } from '@/utilities/getSocialIcon'
import { SiteInfo } from '@/payload-types'
import { COLLECTION_URL_PATHS, COLLECTION_SLUGS } from '@/constants'

const date = new Date(Date.now())
const formattedDate = writingDate(date.getTime())

const colors = ['text-primary', 'text-secondary', 'text-tertiary', 'text-accent']

const links = [
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
    link: '#',
  },
  {
    label: 'tabela brasileirão',
    link: '#',
    color: 'text-red-500',
  },
  {
    label: 'contato',
    link: '#',
  },
]

export async function Header() {
  const siteInfo = (await getCachedGlobal(COLLECTION_SLUGS.SiteInfo, 1)()) as SiteInfo

  return (
    <header className="sticky top-0 z-50 mb-10 border-b-4 border-b-secondary bg-primary">
      <div className="relative w-full bg-white">
        <div className="container flex gap-4 overflow-auto">
          {links.map((link, i) => (
            <a
              href={link.link}
              key={i}
              className={cn(
                'whitespace-nowrap border-y-4 border-transparent border-b-transparent px-1 py-1 font-globo text-lg font-bold transition-colors hover:border-b-red-400',
                link.color ? link.color : colors[i % colors.length],
                'hover:border-b-current',
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent"></div>
      </div>

      <div className="container grid grid-cols-2 items-center py-4 text-primary-foreground lg:grid-cols-3 lg:py-2">
        <span className="hidden justify-self-start text-sm lg:block">{formattedDate}</span>

        <Link href="/" className="justify-self-start lg:justify-self-center">
          <ImageMedia resource={siteInfo.logo} imgClassName="w-[400px] md:w-[250px]" />
        </Link>

        <div className="flex gap-2 justify-self-end">
          {siteInfo.socials?.map((social, i) => (
            <a
              key={i}
              href={social.link}
              target="_blank"
              className="size-min rounded-full bg-white/20 p-2 transition-all hover:scale-[110%]"
            >
              <FontAwesomeIcon icon={getSocialIcon(social.type)} className="size-7" />
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
