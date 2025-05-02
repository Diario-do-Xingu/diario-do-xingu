import { COLLECTION_SLUGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { redirect } from 'next/navigation'
import { CountRead } from './CountRead'
import { Grid, GridLeft, GridRight } from '@/components/Grid'
import { ArticleMostReadSection } from '@/components/ArticleMostReadSection'
import { WeatherWidget } from '@/components/WeatherWidget'
import { SoccerWidget } from '@/components/SoccerWidget'

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
      <CountRead articleId={article.id} currentReadCount={article.readCount || 0} />
      <Grid>
        <GridLeft>{article.heading}</GridLeft>

        <GridRight className="space-y-5">
          <ArticleMostReadSection />

          <WeatherWidget />

          <SoccerWidget />
        </GridRight>
      </Grid>
    </div>
  )
}
