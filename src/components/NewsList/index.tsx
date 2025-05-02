import { Fragment } from 'react'
import { NewsCard } from '../NewsCard'
import { PaginatedDocs } from 'payload'
import { News } from '@/payload-types'

type NewsListProps = {
  news: PaginatedDocs<News>
}

export function NewsList(props: NewsListProps) {
  const { news } = props

  const { docs, totalDocs } = news
  return (
    <div className="flex flex-col gap-9">
      {docs.map((item, i) => {
        return (
          <Fragment key={item.slug!}>
            <NewsCard doc={item} />

            {i < totalDocs - 1 && <div className="divider h-[1px] bg-zinc-300"></div>}
          </Fragment>
        )
      })}
    </div>
  )
}
