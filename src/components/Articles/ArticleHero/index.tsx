import { ArticleShareLinks } from '@/components/ArticleShareLinks'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { RelativePublishedAtClient } from '@/components/RelativePublishedAtClient'
import { COLLECTION_URL_PATHS } from '@/constants'
import type { News } from '@/payload-types'
import { joinWithAnd } from '@/utilities/formatString'
import { getClientSideURL } from '@/utilities/getURL'

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
            <RelativePublishedAtClient publishedAt={publishedAt} />
          </div>
        )}
      </div>

      <ArticleShareLinks
        text={heading}
        className="w-full"
        link={`${getClientSideURL()}/${COLLECTION_URL_PATHS.News}/${slug}`}
      />

      {bannerImage && typeof bannerImage !== 'string' && (
        <div>
          <ImageMedia
            resource={bannerImage}
            imgClassName="rounded-default w-full max-h-[600px] object-cover"
          />

          {bannerDescription && (
            <span className="ps-2 text-xs text-zinc-600">{bannerDescription}</span>
          )}
        </div>
      )}
    </div>
  )
}
