import React from 'react'

import { Advertisement } from '@/components/Advertisement'
import { Grid, GridLeft, GridRight } from '@/components/Grid'
import { HomeNewsGrid } from '@/components/HomeNewsGrid'
import { MostReadCard } from '@/components/MostReadCard'
import { NewsList } from '@/components/NewsList'
import { SoccerWidget } from '@/components/SoccerWidget'
import { WeatherWidget } from '@/components/WeatherWidget'
import { ARCHIVE_LIMIT, COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HomePage() {
  const payload = await getPayload()

  const news = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: ARCHIVE_LIMIT.News,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return (
    <div className="container-y-padding">
      <HomeNewsGrid />

      <Grid className="container mt-20">
        <GridLeft>
          <h2 className="text-3xl text-primary">Destaques</h2>
          <div className="mb-5 mt-2 h-px bg-foreground"></div>

          <NewsList news={news} />

          <Button asChild className="mt-20 w-full text-lg font-bold" size="lg">
            <Link href={COLLECTION_URL_PATHS.News}>Ver todas</Link>
          </Button>
        </GridLeft>

        <GridRight className="space-y-5">
          <MostReadCard />

          <WeatherWidget />

          <SoccerWidget />

          <Advertisement />
        </GridRight>
      </Grid>
    </div>
  )
}
