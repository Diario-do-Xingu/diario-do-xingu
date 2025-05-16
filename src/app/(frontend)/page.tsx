import React from 'react'

import { Advertisement } from '@/components/Advertisement'
import { Grid, GridLeft, GridRight } from '@/components/Grid'
import { HomeHeroArticleGrid } from '@/components/HomeHeroArticleGrid'
import { ArticleMostReadSection } from '@/components/ArticleMostReadSection'
import { ArticleList } from '@/components/ArticleList'
import { SoccerWidget } from '@/components/SoccerWidget'
import { WeatherWidget } from '@/components/WeatherWidget'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArticleHighlightSection } from '@/components/ArticleHighlightSection'

export default async function HomePage() {
  const payload = await getPayload()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: 13,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return (
    <div className="container-y-padding">
      <HomeHeroArticleGrid />

      <Grid className="container mt-20">
        <GridLeft>
          <h2 className="text-3xl text-primary">Últimas Notícias</h2>
          <div className="mb-5 mt-2 h-px bg-foreground"></div>

          <ArticleList
            news={{
              ...news,
              docs: news.docs.slice(3).filter(Boolean),
            }}
          />

          <Button asChild className="mt-14 w-full text-lg font-bold" size="lg">
            <Link href={COLLECTION_URL_PATHS.News}>Ver todas</Link>
          </Button>
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
