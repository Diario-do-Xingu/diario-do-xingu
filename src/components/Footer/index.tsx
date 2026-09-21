import Link from 'next/link'
import defaultLogo from '@/assets/images/default-logo.png'
import { CoffeeIcon, EnvelopeIcon, WhatsappIcon } from '@/components/icons'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { COLLECTION_SLUGS } from '@/constants'
import { env } from '@/env'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSocialIcon } from '@/utilities/getSocialIcon'

export async function Footer() {
  const siteInfo = await getCachedGlobal(COLLECTION_SLUGS.SiteInfo, 1)

  const hasLogo = 'logo' in siteInfo
  // An unpopulated logo (a bare ID) falls back to the default logo
  const logo = typeof siteInfo.logo === 'object' ? siteInfo.logo : undefined
  const logoAlt = hasLogo ? logo?.alt || 'Logo Diário do Xingu' : ''
  const commit = env.NEXT_PUBLIC_APP_COMMIT
  // The build commit is usually a git SHA, but a custom SENTRY_RELEASE can be any name; only a SHA gets a link
  const isSha = commit !== undefined && /^[0-9a-f]{7,40}$/i.test(commit)

  return (
    <footer className="border-t-4 border-t-tertiary bg-primary py-3 pb-4 font-varela text-primary-foreground">
      <div className="container">
        <div className="mb-4 grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
          <Link href="/" className="justify-self-center lg:justify-self-start">
            {logo ? (
              <ImageMedia
                alt={logoAlt}
                imgClassName={'w-[200px]'}
                resource={logo}
                variant="card"
                sizes="200px"
              />
            ) : (
              <ImageMedia
                alt={logoAlt}
                imgClassName={'w-[200px]'}
                src={defaultLogo}
                sizes="200px"
              />
            )}
          </Link>

          <div className="flex flex-col items-center justify-self-center tracking-wide lg:items-start lg:justify-self-center">
            {siteInfo.contacts?.email && (
              <span className="flex items-center">
                <EnvelopeIcon className="mr-2 size-5" />
                {siteInfo.contacts.email}
              </span>
            )}
            {siteInfo.contacts?.phone?.value && (
              <span className="flex items-center">
                <WhatsappIcon className="mr-2 size-5" />
                {siteInfo.contacts.phone.value}
              </span>
            )}
          </div>

          <div className="flex gap-2 justify-self-center lg:justify-self-end">
            {siteInfo.socials?.map((social) => {
              const SocialIcon = getSocialIcon(social.type)

              return (
                <a
                  key={social.id ?? social.link}
                  href={social.link}
                  target="_blank"
                  aria-label={`Abrir ${social.label}`}
                  className="grid place-items-center rounded-full bg-white/20 p-2 transition-transform hover:scale-[110%]"
                  rel="noopener"
                >
                  <SocialIcon className="size-7" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs tracking-wide">
            © {new Date().getFullYear()} Diário do Xingu - Todos os direitos reservados
          </span>
          <span className="text-xs tracking-wide">
            Developed with <CoffeeIcon className="inline size-4" /> by{' '}
            <b className="font-globo">vkav labs</b>
          </span>
          <span className="text-xs tracking-wide">
            v{env.NEXT_PUBLIC_APP_VERSION} ·{' '}
            {isSha ? (
              <a
                href={`https://github.com/Diario-do-Xingu/diario-do-xingu/commit/${commit}`}
                target="_blank"
                rel="noopener"
                title="Ver esta versão no GitHub"
                className="hover:underline"
              >
                {commit.slice(0, 7)}
              </a>
            ) : (
              (commit ?? 'dev')
            )}
          </span>
        </div>
      </div>
    </footer>
  )
}
