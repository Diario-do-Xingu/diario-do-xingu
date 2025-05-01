// import { Advertisement } from '@/components/Advertisement'
import { Advertisement } from '@/components/Advertisement'
import { NewsCard } from '@/components/NewsCard'
import { Pagination } from '@/components/Pagination'
import { SoccerWidget } from '@/components/SoccerWidget'
import { Card } from '@/components/ui/card'
import { WeatherWidget } from '@/components/WeatherWidget'
import { COLLECTION_URL_PATHS } from '@/constants'
import { News } from '@/payload-types'
import { PaginatedDocs } from 'payload'
import { Fragment } from 'react'

type PageComponentProps = {
  news: PaginatedDocs<News>
}

export function PageComponent({ news }: PageComponentProps) {
  const { docs } = news

  const firstListNumber = 6
  const filteredFirstThree = docs.slice(0, firstListNumber).filter(Boolean)
  const restDocs = docs.slice(firstListNumber).filter(Boolean)

  return (
    <>
      <div className="col-span-1 lg:col-span-12">
        <h2>Últimas Notícias</h2>
        <div className="mb-5 mt-2 h-[1px] bg-foreground"></div>
      </div>

      <div className="col-span-1 -mt-10 flex flex-col gap-9 lg:col-span-12">
        {filteredFirstThree.map((item) => {
          return (
            <Fragment key={item.slug!}>
              <NewsCard doc={item} />

              <div className="divider h-[1px] bg-zinc-400"></div>
            </Fragment>
          )
        })}
      </div>

      <div className="col-span-1 lg:col-span-8">
        <div className="flex flex-col gap-9">
          {restDocs.map((item) => {
            return (
              <Fragment key={item.slug!}>
                <NewsCard doc={item} />

                <div className="divider h-[1px] bg-zinc-400"></div>
              </Fragment>
            )
          })}
        </div>

        {news.totalPages > 1 && news.page && (
          <Pagination
            path={COLLECTION_URL_PATHS.News}
            page={news.page}
            totalPages={news.totalPages}
            className="my-5"
          />
        )}
      </div>

      <div className="col-span-1 flex flex-col gap-4 lg:col-span-4">
        <Card className="bg-accent p-3">
          <WeatherWidget />
        </Card>

        <Card className="bg-secondary p-3">
          <SoccerWidget />
        </Card>

        <Advertisement />
      </div>
    </>
  )
}
