import { News, NewsCategory } from '@/payload-types'
import { ImageMedia } from '../Media/ImageMedia'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { formatDateAndRelative } from '@/utilities/formatDate'
import { getServerSideURL } from '@/utilities/getURL'
import { COLLECTION_URL_PATHS } from '@/constants'
import { cn } from '@/utilities/ui'

export type NewsData = Pick<
  News,
  'slug' | 'heading' | 'subheading' | 'heroImage' | 'category' | 'publishedAt' | 'highligh'
>

type ArticleListCardProps = {
  doc: NewsData
}

function getNewsLink(slug: string) {
  // return '#'
  return `${getServerSideURL()}/${COLLECTION_URL_PATHS.News}/${slug}`
}

export function ArticleListCard(props: ArticleListCardProps) {
  const { doc } = props

  const category = doc.category as NewsCategory

  return (
    <Link
      href={getNewsLink(doc.slug!)}
      className="grid gap-3 transition-transform lg:grid-cols-12 lg:gap-5 lg:hover:scale-[103%]"
    >
      <div className="aspect-[3/2] overflow-hidden rounded-xl shadow-md shadow-zinc-400 lg:col-span-5">
        <ImageMedia
          resource={doc.heroImage.image}
          alt={doc.heroImage.description ?? ''}
          imgClassName="object-cover h-full"
        />
      </div>

      <div className="flex flex-col gap-2.5 lg:col-span-7 lg:pt-1">
        <span className="font-globo text-sm font-bold text-primary">{doc.highligh}</span>

        <div className="flex flex-col gap-1">
          <h3 className="font-globo text-xl font-bold leading-snug lg:text-2xl">{doc.heading}</h3>
          {doc.subheading && (
            <h6 className="text-sm font-semibold leading-snug text-zinc-600">{doc.subheading}</h6>
          )}
        </div>

        <Badge variant="accent" className={cn('mt-2 w-max')}>
          <span className="text-sm font-bold tracking-wide">{`${category.name}`}</span>
        </Badge>

        <span className="text-xs font-bold tracking-wide text-red-600">
          {formatDateAndRelative(doc.publishedAt ?? '')}
        </span>
      </div>
    </Link>
  )
}
