'use client'

import { cn } from '@/utilities/ui'
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

type ArticleShareLinksProps = {
  text: string
  link: string
  className?: string
}

export function ArticleShareLinks({ link, text, className }: ArticleShareLinksProps) {
  const [isShareSupported, setIsShareSupported] = useState(false)

  useEffect(() => {
    // Check if the Web Share API is supported
    setIsShareSupported(!!navigator?.share)
  }, [])

  return (
    <div className={cn('flex flex-nowrap gap-4', className)}>
      <a
        className="group flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-card p-3 transition-colors hover:cursor-pointer hover:bg-[#1877F2] hover:brightness-90"
        href={`https://www.facebook.com/sharer/sharer.php?u=${link}`}
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="Compartilhar artigo no facebook"
        data-umami-event-title={text}
      >
        <FontAwesomeIcon
          icon={faFacebook}
          className="size-5 text-[#1877F2] group-hover:text-white"
        />
      </a>
      <a
        className="group flex flex-1 items-center justify-center rounded-xl bg-card p-3 transition-colors hover:cursor-pointer hover:bg-[#25D366] hover:brightness-90"
        href={`https://api.whatsapp.com/send?text=${link}`}
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="Compartilhar artigo no whatsapp"
        data-umami-event-title={text}
      >
        <FontAwesomeIcon
          icon={faWhatsapp}
          className="size-6 text-[#25D366] group-hover:text-white"
        />
      </a>
      {isShareSupported && (
        <button
          data-umami-event="Compartilhar artigo geral"
          data-umami-event-title={text}
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  text: text,
                  url: link,
                })
              } catch {}
            }
          }}
          className="group flex flex-1 items-center justify-center rounded-xl bg-card p-3 transition-colors hover:cursor-pointer hover:bg-[#4f5257] hover:brightness-90"
        >
          <FontAwesomeIcon
            icon={faShareNodes}
            className="size-6 text-[#4f5257] group-hover:text-white"
          />
        </button>
      )}
    </div>
  )
}
