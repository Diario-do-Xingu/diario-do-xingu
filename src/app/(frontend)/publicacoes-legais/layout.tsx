import type React from 'react'
import { Advertisement } from '@/components/Advertisement'
import { Grid, GridRight } from '@/components/Grid'
import { SoccerWidget } from '@/components/SoccerWidget'
import { WeatherWidget } from '@/components/WeatherWidget'
import { COLLECTION_URL_PATHS } from '@/constants'
import { buildPageMetadata } from '@/utilities/buildPageMetadata'

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <Grid className="container-y-padding container gap-y-10">
      {children}

      <GridRight className="space-y-5">
        <WeatherWidget />
        <Advertisement adType="firstSideAdsBanner" />
        <SoccerWidget />
        <Advertisement adType="secondSideAdsBanner" />
      </GridRight>
    </Grid>
  )
}

export const generateMetadata = () =>
  buildPageMetadata({ title: 'Publicações Legais', path: COLLECTION_URL_PATHS.NotarialActs })
