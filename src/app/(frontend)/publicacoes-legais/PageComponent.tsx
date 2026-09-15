import type { PaginatedDocs } from 'payload'
import { Suspense } from 'react'
import { GridLeft } from '@/components/Grid'
import { NotarialActsCard } from '@/components/NotarialActsCard'
import { Pagination } from '@/components/Pagination'
import { Badge } from '@/components/ui/badge'
import { COLLECTION_URL_PATHS } from '@/constants'
import type { NotarialAct } from '@/payload-types'
import type { NotarialActsFilter } from './findNotarialActs'
import { SearchForm } from './SearchForm'

type PageComponentProps = {
  notarialActs: PaginatedDocs<NotarialAct>
  filter?: NotarialActsFilter
}

export function PageComponent({ notarialActs, filter = {} }: PageComponentProps) {
  // An active filter keeps its query on the page links, so page N stays filtered.
  const query = new URLSearchParams()
  if (filter.date) query.set('date', filter.date)
  if (filter.key) query.set('key', filter.key)

  return (
    <GridLeft>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-primary leading-normal">Últimas Publicações</h1>

        <div className="flex flex-col items-end gap-1 text-nowrap md:flex-row md:gap-3">
          <Badge variant="accent">{`Exibindo ${notarialActs.docs.length} registros`}</Badge>
          <Badge>{`Total ${notarialActs.totalDocs} registros`}</Badge>
        </div>
      </div>
      <div className="mt-2 h-px bg-foreground"></div>

      <div className="mt-10 flex flex-col gap-2">
        <h3 className="text-primary">Consulta</h3>
        <Suspense>
          <SearchForm />
        </Suspense>
      </div>

      <div className="mt-2 h-px bg-foreground"></div>

      <div className="mt-10 flex flex-col gap-3">
        {notarialActs.docs.map((doc) => (
          <NotarialActsCard key={doc.id} doc={doc} />
        ))}
      </div>

      {notarialActs.totalPages > 1 && notarialActs.page && (
        <Pagination
          path={COLLECTION_URL_PATHS.NotarialActs}
          page={notarialActs.page}
          totalPages={notarialActs.totalPages}
          query={query.size ? query.toString() : undefined}
          className="my-10"
        />
      )}
    </GridLeft>
  )
}
