import { GridLeft } from '@/components/Grid'
import { NotarialActsCard } from '@/components/NotarialActsCard'
import { Pagination } from '@/components/Pagination'
import { Badge } from '@/components/ui/badge'
import { COLLECTION_URL_PATHS } from '@/constants'
import { NotarialAct } from '@/payload-types'
import { PaginatedDocs } from 'payload'

type PageComponentProps = {
  notarialActs: PaginatedDocs<NotarialAct>
}

export function PageComponent({ notarialActs }: PageComponentProps) {
  return (
    <GridLeft>
      <div className="flex items-center justify-between">
        <h2 className="text-primary">Últimas Publicações</h2>

        <div className="flex flex-col items-end gap-1 text-nowrap md:flex-row md:gap-3">
          <Badge variant="accent">{`Exibindo ${notarialActs.docs.length} registros`}</Badge>
          <Badge>{`Total ${notarialActs.totalDocs} registros`}</Badge>
        </div>
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
          className="my-10"
        />
      )}
    </GridLeft>
  )
}
