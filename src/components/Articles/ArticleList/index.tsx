import type { PaginatedDocs } from 'payload'
import { Fragment } from 'react'
import type { News } from '@/payload-types'
import { ArticleListCard } from '../ArticleListCard'

type ArticleListProps = {
  news: PaginatedDocs<News>
}

export function ArticleList(props: ArticleListProps) {
  const { news } = props

  const { docs, totalDocs } = news

  return (
    <div className="flex flex-col gap-9">
      {docs.map((article, i) => {
        const showDivider = i < totalDocs - 1

        return (
          <Fragment key={article.slug}>
            <ArticleListCard article={article} />

            {showDivider && <div className="divider h-[1px] bg-zinc-300"></div>}
          </Fragment>
        )
      })}
    </div>
  )
}
