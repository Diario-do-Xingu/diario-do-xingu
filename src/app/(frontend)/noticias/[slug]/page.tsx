import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { redirect } from 'next/navigation'
import { CountRead } from './CountRead'
import { Grid, GridLeft, GridRight } from '@/components/Grid'
import { ArticleMostReadSection } from '@/components/ArticleMostReadSection'
import { WeatherWidget } from '@/components/WeatherWidget'
import { SoccerWidget } from '@/components/SoccerWidget'
import { joinWithAnd } from '@/utilities/formatString'
import { formatDateAndRelative } from '@/utilities/formatDate'
import { ArticleShareLinks } from '@/components/ArticleShareLinks'
import { getClientSideURL } from '@/utilities/getURL'
import { ArticleHighlightSection } from '@/components/ArticleHighlightSection'
import { Advertisement } from '@/components/Advertisement'
import RichText from '@/components/RichText'
import { ImageMedia } from '@/components/Media/ImageMedia'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const payload = await getPayload()

  const {
    docs: [article],
  } = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!article) return redirect('/')

  const authors = (article.populatedAuthors ?? []).map((a) => a.name!)

  return (
    <div>
      <CountRead articleId={article.id} currentReadCount={article.readCount || 0} />
      <Grid className="container-y-padding container">
        <GridLeft>
          <div className="space-y-5">
            <h1 className="text-3xl text-primary">{article.heading}</h1>

            {article.subheading && (
              <h2 className="text text-base font-normal">{article.subheading}</h2>
            )}

            <div className="space-y-1">
              <p className="font-globo text-sm font-bold text-zinc-600">
                Por {joinWithAnd(authors)}
              </p>
              <p className="text-xs font-medium text-zinc-500">
                {formatDateAndRelative(article.publishedAt || '')}
              </p>
            </div>

            <ArticleShareLinks
              text={article.heading}
              className="w-full"
              link={`${getClientSideURL()}/${COLLECTION_URL_PATHS.News}/${article.slug}`}
            />
          </div>

          <div className="mt-10 space-y-5 lg:space-y-10">
            <div className="overflow-hidden">
              <ImageMedia resource={article.heroImage.image} imgClassName="rounded-default" />
              {article.heroImage.description && (
                <span className="ps-2 text-xs text-zinc-600">{article.heroImage.description}</span>
              )}
            </div>

            <RichText data={article.content} enableGutter={false} />
          </div>
        </GridLeft>

        <GridRight className="mt-10 space-y-5 lg:mt-0">
          <ArticleHighlightSection />
          <WeatherWidget />
          <ArticleMostReadSection />
          <Advertisement />
          <SoccerWidget />
        </GridRight>
      </Grid>
    </div>
  )
}
