import { Fragment } from 'react'
import { ArticleListCard } from '../ArticleListCard'
import { PaginatedDocs } from 'payload'
import { News } from '@/payload-types'

type ArticleListProps = {
  news: PaginatedDocs<News>
}

export function ArticleList(props: ArticleListProps) {
  const { news } = props

  const { docs, totalDocs } = news
  return (
    <div className="flex flex-col gap-9">
      {docs.map((item, i) => {
        return (
          <Fragment key={item.slug!}>
            <ArticleListCard doc={item} />

            {i < totalDocs - 1 && <div className="divider h-[1px] bg-zinc-300"></div>}
          </Fragment>
        )
      })}
    </div>
  )
}
