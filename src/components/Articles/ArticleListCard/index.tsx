import Link from 'next/link'
import { COLLECTION_URL_PATHS } from '@/constants'
import type { News } from '@/payload-types'
import { ImageMedia } from '../../Media/ImageMedia'
import { RelativePublishedAtClient } from '../../RelativePublishedAtClient'
import { Badge } from '../../ui/badge'

type ArticleListCardProps = {
  article: News
}

export function ArticleListCard({ article }: ArticleListCardProps) {
  const { subheading, category, heading, heroImage, slug, highligh, publishedAt } = article

  const { image: bannerImage, description: bannerDescription } = heroImage

  return (
    <Link
      href={`/${COLLECTION_URL_PATHS.News}/${slug}`}
      className="grid gap-3 transition-transform lg:grid-cols-12 lg:gap-5 lg:hover:scale-[103%]"
    >
      <div className="aspect-[3/2] overflow-hidden rounded-xl shadow-md shadow-zinc-400 lg:col-span-5">
        {bannerImage && typeof bannerImage !== 'string' && (
          <ImageMedia
            resource={bannerImage}
            alt={bannerDescription ?? ''}
            imgClassName="object-cover w-full h-full"
          />
        )}
      </div>

      <div className="flex flex-col gap-2.5 lg:col-span-7 lg:pt-1">
        <span className="font-bold font-globo text-primary text-sm">{highligh}</span>

        <div className="flex flex-col gap-1">
          <h3 className="font-bold font-globo text-xl leading-snug lg:text-2xl">{heading}</h3>

          {subheading && (
            <h6 className="font-semibold text-sm text-zinc-600 leading-snug">{subheading}</h6>
          )}
        </div>

        {typeof category === 'object' && (
          <Badge variant="accent" className="mt-2 w-max">
            <span className="font-bold text-sm tracking-wide">{`${category.name}`}</span>
          </Badge>
        )}

        {publishedAt && (
          <div className="font-bold text-red-600 text-xs tracking-wide">
            <RelativePublishedAtClient publishedAt={publishedAt} />
          </div>
        )}
      </div>
    </Link>
  )
}
