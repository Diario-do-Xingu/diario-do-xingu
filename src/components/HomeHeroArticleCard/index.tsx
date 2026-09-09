import Image from 'next/image'
import Link from 'next/link'
import { COLLECTION_URL_PATHS } from '@/constants'
import type { ArticleMedia, News } from '@/payload-types'
import { imageVariant } from '@/utilities/imageVariant'
import { cn } from '@/utilities/ui'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'

type HomeHeroArticleCardProps = {
  size: 'lg' | 'sm'
  doc: Pick<News, 'heading' | 'subheading' | 'heroImage' | 'highligh' | 'slug'>
  index: number
}

const colors = ['secondary', 'accent', 'tertiary'] as const

export function HomeHeroArticleCard(props: HomeHeroArticleCardProps) {
  const { size, doc, index } = props

  const image = doc.heroImage.image as ArticleMedia
  const imageAlt = doc.heroImage.description || ''
  const hero = imageVariant(image, 'hero')

  return (
    <Link
      href={`/${COLLECTION_URL_PATHS.News}/${doc.slug}`}
      className={cn(
        `col-span-1 row-span-${size === 'lg' ? '2' : '1'}`,
        'min-h-[300px] max-w-4xl lg:min-h-[auto]',
      )}
    >
      <Card
        className={cn('group relative', 'h-full', 'overflow-hidden bg-transparent shadow-none')}
      >
        <Image
          alt={imageAlt}
          className="absolute h-full w-full object-cover brightness-[40%] transition-transform duration-300 group-hover:scale-[105%]"
          height={hero.height}
          src={hero.src}
          width={hero.width}
          // The grid is one column up to lg and two columns (max 80rem) above it.
          sizes="(min-width: 1024px) 640px, 100vw"
          // The first card is the largest thing above the fold: fetch it first.
          priority={index === 0}
        />

        <CardContent className={cn('h-full p-5 pb-10', 'flex flex-col gap-16')}>
          {doc.highligh && (
            <Badge
              className={cn('relative w-max font-bold text-sm')}
              variant={colors[index % colors.length]}
            >
              {doc.highligh}
            </Badge>
          )}

          <div className={cn('mt-auto flex flex-col')}>
            <h2 className="mt-6 font-bold text-2xl text-white leading-tight drop-shadow-xl">
              {doc.heading}
            </h2>

            {doc.subheading && (
              <p className="mt-4 text-clip font-bold text-md text-zinc-100/90 drop-shadow-xl">
                {doc.subheading}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
