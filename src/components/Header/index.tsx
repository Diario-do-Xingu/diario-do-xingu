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
    link: '#',
  },
  {
    label: 'editorias',
    link: '#',
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
      <div className="bg-white">
        <div className="container flex gap-4">
          {links.map((link, i) => (
            <a
              href={link.link}
              key={i}
              className={cn(
                'font-varela text-md border-y-4 border-transparent border-b-transparent px-1 py-1 transition-colors hover:border-b-red-400',
                colors[i % colors.length],
                'hover:border-b-current',
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="container grid grid-cols-1 items-center py-2 text-primary-foreground lg:grid-cols-3">
        <span className="hidden justify-self-start text-sm lg:block">{formattedDate}</span>

        <Link href="/" className="justify-self-center">
          <ImageMedia resource={siteInfo.logo} imgClassName="w-[200px]" />
        </Link>

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
    </header>
  )
}
