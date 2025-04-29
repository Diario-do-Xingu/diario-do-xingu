// import { Advertisement } from '@/components/Advertisement'
import { NotarialActsCard } from '@/components/NotarialActsCard'
import { Pagination } from '@/components/Pagination'
import { SoccerWidget } from '@/components/SoccerWidget'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { WeatherWidget } from '@/components/WeatherWidget'
import { COLLECTION_URL_PATHS } from '@/constants'
import { NotarialAct } from '@/payload-types'
import { PaginatedDocs } from 'payload'

type PageComponentProps = {
  notarialActs: PaginatedDocs<NotarialAct>
}

export function PageComponent({ notarialActs }: PageComponentProps) {
  return (
    <div className="col-span-3 lg:col-span-8">
      <div className="flex items-center justify-between">
        <h2 className="">Últimas Publicações</h2>

        <div className="space-x-2">
          <Badge variant="accent">{`Exibindo ${notarialActs.docs.length} registros`}</Badge>
          <Badge>{`Total ${notarialActs.totalDocs} registros`}</Badge>
        </div>
      </div>

      <div className="mb-5 mt-2 h-[1px] bg-foreground"></div>

      <div className="flex flex-col gap-3">
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
    </div>
  )
}
