import Link from 'next/link'
import { ArticleList } from '@/components/Articles/ArticleList'
import { Grid, GridLeft } from '@/components/Grid'
import { HomeHeroArticleGrid } from '@/components/HomeHeroArticleGrid'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { getSiteMeta } from '@/utilities/getSiteMeta'

// Same 10-minute window as the list routes. Hooks refresh this page on manual publishes;
// scheduled publishes run in the job cron, outside a request, where revalidation is not
// available, so this window is what brings them to the front page.
export const revalidate = 600

export default async function HomePage() {
  const payload = await getPayload()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: 20,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  const heroDocs = news.docs.slice(0, 3).filter(Boolean)
  const { siteName } = await getSiteMeta()

  return (
    <div className="container-y-padding">
      <h1 className="sr-only">{siteName}</h1>
      <HomeHeroArticleGrid docs={heroDocs} />

      <Grid className="container mt-20">
        <GridLeft>
          <h2 className="text-3xl text-primary">Últimas Notícias</h2>
          <div className="mt-2 mb-5 h-px bg-foreground"></div>

          <ArticleList
            news={{
              ...news,
              docs: news.docs.slice(3).filter(Boolean),
            }}
          />

          <Button asChild className="mt-14 w-full font-bold text-lg" size="lg">
            <Link href={`/${COLLECTION_URL_PATHS.News}`}>Ver todas</Link>
          </Button>
        </GridLeft>
        <Sidebar className="mt-10 lg:mt-0" />
      </Grid>
    </div>
  )
}
