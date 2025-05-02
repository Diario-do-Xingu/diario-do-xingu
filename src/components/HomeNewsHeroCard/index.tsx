import { Media, News } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { getServerSideURL } from '@/utilities/getURL'
import { COLLECTION_URL_PATHS } from '@/constants'

type HomeNewsHeroCardProps = {
  size: 'lg' | 'sm'
  doc: Pick<News, 'heading' | 'subheading' | 'heroImage' | 'highligh' | 'slug'>
  index: number
}

const colors = ['secondary', 'accent', 'tertiary'] as const

export function HomeNewsHeroCard(props: HomeNewsHeroCardProps) {
  const { size, doc, index } = props

  const image = doc.heroImage.image as Media
  const imageAlt = doc.heroImage.description || image.alt || ''

  return (
    <Link
      href={`${getServerSideURL()}/${COLLECTION_URL_PATHS.News}/${doc.slug}`}
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
          className="absolute -z-10 h-full w-full object-cover brightness-[40%] transition-transform duration-300 group-hover:scale-[105%]"
          height={image.height!}
          quality={100}
          src={image.url!}
          width={image.width!}
        />

        <CardContent className={cn('h-full p-5 pb-10', 'flex flex-col gap-16')}>
          {doc.highligh && (
            <Badge
              className={cn('w-max text-sm font-bold')}
              variant={colors[index % colors.length]}
            >
              {doc.highligh}
            </Badge>
          )}

          <div className={cn('mt-auto flex flex-col')}>
            <h3 className="mt-6 text-2xl font-bold leading-tight text-white drop-shadow-xl">
              {doc.heading}
            </h3>

            {doc.subheading && (
              <p className="text-md mt-4 text-clip font-bold text-zinc-100/90 drop-shadow-xl">
                {doc.subheading}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
