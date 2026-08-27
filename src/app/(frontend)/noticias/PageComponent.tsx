import type { PaginatedDocs } from 'payload'
import { Advertisement } from '@/components/Advertisement'
import { ArticleHighlightSection } from '@/components/ArticleHighlightSection'
import { ArticleMostReadSection } from '@/components/ArticleMostReadSection'
import { ArticleList } from '@/components/Articles/ArticleList'
import { DigitalEditionsSection } from '@/components/DigitalEditions/DigitalEditionsSection'
import { Grid, GridFull, GridLeft, GridRight } from '@/components/Grid'
import { Pagination } from '@/components/Pagination'
import { SoccerWidget } from '@/components/SoccerWidget'
import { WeatherWidget } from '@/components/WeatherWidget'
import { COLLECTION_URL_PATHS } from '@/constants'
import type { News } from '@/payload-types'

type PageComponentProps = {
  news: PaginatedDocs<News>
}

export function PageComponent({ news }: PageComponentProps) {
  const { docs } = news

  const firstListNumber = 3
  const filteredFirstThree = docs.slice(0, firstListNumber).filter(Boolean)
  const restDocs = docs.slice(firstListNumber).filter(Boolean)

  return (
    <Grid className="container-y-padding container gap-y-10">
      <GridFull>
        <h2 className="text-primary">Últimas Notícias</h2>
        <div className="mt-2 h-px bg-foreground"></div>
      </GridFull>

      <GridFull className="mb-20 flex flex-col gap-10">
        <ArticleList
          news={{
            ...news,
            totalDocs: filteredFirstThree.length,
            docs: filteredFirstThree,
          }}
        />
      </GridFull>

      <GridLeft className="space-y-20">
        <ArticleList
          news={{
            ...news,
            totalDocs: restDocs.length,
            docs: restDocs,
          }}
        />

        {news.totalPages > 1 && news.page && (
          <Pagination
            path={COLLECTION_URL_PATHS.News}
            page={news.page}
            totalPages={news.totalPages}
            className="my-5"
          />
        )}
      </GridLeft>

      <GridRight className="space-y-5">
        <ArticleHighlightSection />
        <WeatherWidget />
        <ArticleMostReadSection />
        <DigitalEditionsSection />
        <Advertisement adType="firstSideAdsBanner" />
        <SoccerWidget />
        <Advertisement adType="secondSideAdsBanner" />
      </GridRight>
    </Grid>
  )
}
