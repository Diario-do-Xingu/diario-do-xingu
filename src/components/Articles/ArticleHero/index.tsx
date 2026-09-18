import { ArticleShareLinks } from '@/components/ArticleShareLinks'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { RelativePublishedAt } from '@/components/RelativePublishedAt'
import { COLLECTION_URL_PATHS } from '@/constants'
import { env } from '@/env'
import type { News } from '@/payload-types'
import { joinWithAnd } from '@/utilities/formatString'

type ArticleHero = {
  article: News
}

export function ArticleHero({ article }: ArticleHero) {
  const { heading, subheading, authors, publishedAt, slug, heroImage } = article

  const hasAuthors =
    authors && authors.length > 0 && joinWithAnd(authors.map(({ name }) => name ?? '')) !== ''

  const { image: bannerImage, description: bannerDescription } = heroImage

  return (
    <div className="space-y-5">
      <h1 className="text-3xl text-primary">{heading}</h1>

      {subheading && <h2 className="text font-normal text-base">{subheading}</h2>}

      <div className="space-y-1">
        {hasAuthors && (
          <p className="font-bold font-globo text-sm text-zinc-600">
            Por {joinWithAnd(authors.map(({ name }) => name ?? ''))}
          </p>
        )}

        {publishedAt && (
          <div className="font-medium text-xs text-zinc-500">
            <RelativePublishedAt publishedAt={publishedAt} />
          </div>
        )}
      </div>

      <ArticleShareLinks
        text={heading}
        className="w-full"
        link={`${env.NEXT_PUBLIC_SERVER_URL}/${COLLECTION_URL_PATHS.News}/${slug}`}
      />

      {bannerImage && typeof bannerImage !== 'string' && (
        <div>
          <ImageMedia
            resource={bannerImage}
            imgClassName="rounded-default w-full max-h-[600px] object-cover"
            sizes="(min-width: 1024px) 800px, 100vw"
            priority
          />

          {bannerDescription && (
            <span className="ps-2 text-xs text-zinc-600">{bannerDescription}</span>
          )}
        </div>
      )}
    </div>
  )
}
