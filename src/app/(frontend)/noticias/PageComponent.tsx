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
  news: PaginatedDocs<
    Pick<News, 'heading' | 'subheading' | 'publishedAt' | 'category' | 'heroImage' | 'slug'>
  >
}

export function PageComponent({ news }: PageComponentProps) {
  const [first, second, third, ...restDocs] = news.docs

  const filteredFirstThree = [first, second, third].filter(Boolean)

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

    // <div className="col-span-1 lg:col-span-8">
    //   <div className="flex items-center justify-between">
    //     <h2>Últimas Publicações</h2>

    //     <div className="flex flex-col items-end gap-1 text-nowrap md:flex-row md:gap-3">
    //       <Badge variant="accent">{`Exibindo ${notarialActs.docs.length} registros`}</Badge>
    //       <Badge>{`Total ${notarialActs.totalDocs} registros`}</Badge>
    //     </div>
    //   </div>

    //   <div className="mb-5 mt-2 h-[1px] bg-foreground"></div>

    //   <div className="flex flex-col gap-3">
    //     {notarialActs.docs.map((doc) => (
    //       <NotarialActsCard key={doc.id} doc={doc} />
    //     ))}
    //   </div>

    //   {notarialActs.totalPages > 1 && notarialActs.page && (
    //     <Pagination
    //       path={COLLECTION_URL_PATHS.NotarialActs}
    //       page={notarialActs.page}
    //       totalPages={notarialActs.totalPages}
    //       className="my-10"
    //     />
    //   )}
    // </div>
  )
}
