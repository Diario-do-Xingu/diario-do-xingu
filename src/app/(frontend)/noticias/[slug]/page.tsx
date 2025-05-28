import { COLLECTION_SLUGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { redirect } from 'next/navigation'
import { CountRead } from './CountRead'
import { Grid, GridLeft, GridRight } from '@/components/Grid'
import { ArticleMostReadSection } from '@/components/ArticleMostReadSection'
import { WeatherWidget } from '@/components/WeatherWidget'
import { SoccerWidget } from '@/components/SoccerWidget'
import { ArticleHighlightSection } from '@/components/ArticleHighlightSection'
import { Advertisement } from '@/components/Advertisement'
import RichText from '@/components/RichText'

import { ArticleRelatedSection } from '@/components/ArticleRelatedSection'
import { DigitalEditionsSection } from '@/components/DigitalEditions/DigitalEditionsSection'

import { ArticleHero } from '@/components/Articles/ArticleHero'

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

  return (
    <div>
      <CountRead articleId={article.id} />
      <Grid className="container-y-padding container">
        <GridLeft>
          <ArticleHero article={article} />

          <RichText className="mt-8" data={article.content} enableGutter={false} />

          <ArticleRelatedSection
            categoryId={
              typeof article.category === 'string' ? article.category : article.category.id
            }
            currentArticleSlug={article.slug!}
          />
        </GridLeft>

        <GridRight className="mt-10 space-y-5 lg:mt-0">
          <ArticleHighlightSection />
          <WeatherWidget />
          <ArticleMostReadSection />
          <DigitalEditionsSection />
          <Advertisement />
          <SoccerWidget />
        </GridRight>
      </Grid>
    </div>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: COLLECTION_SLUGS.News,
    overrideAccess: false,
    draft: false,
    limit: 100,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = docs.map(({ slug }) => ({ slug }))

  return params
}
