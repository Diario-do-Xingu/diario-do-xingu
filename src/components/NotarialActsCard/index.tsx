import { Calendar, Download, ExternalLink, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { COLLECTION_URL_PATHS } from '@/constants'
import type { NotarialAct } from '@/payload-types'
import { formatDateWithTime } from '@/utilities/formatDate'

type NotarialActsCardProps = {
  doc: NotarialAct
}

export function NotarialActsCard(props: NotarialActsCardProps) {
  const { doc } = props

  const { content, heading, filename, key, publishedAt } = doc

  const downloadLink = doc.url

  return (
    <Card className="bg-[#F8F8F8] transition-all hover:scale-[100.2%] hover:bg-card hover:shadow-xl">
      <Link href={`/${COLLECTION_URL_PATHS.NotarialActs}/${doc.key}`}>
        <CardHeader className="pb-2">
          <h4 className="font-bold">{heading}</h4>
        </CardHeader>
        <CardContent className="space-y-3 pb-5">
          <div className="flex items-center gap-5">
            <p className="flex-1 text-sm">{content}</p>

            <ExternalLink className="size-8 shrink-0" />
          </div>

          <div className="flex flex-col items-start gap-2 md:flex-row">
            <Badge variant="secondary" className="flex gap-2 text-sm">
              <Calendar className="size-4" />
              {formatDateWithTime(publishedAt!, ' -')}
            </Badge>

            <Badge className="flex gap-2 text-sm">
              <KeyRound className="size-4" />
              {`Chave: ${key}`}
            </Badge>
          </div>
        </CardContent>
      </Link>

      {downloadLink && (
        <CardFooter className="flex flex-col items-stretch gap-2">
          <a
            href={downloadLink}
            target="_blank"
            data-umami-event="Abrir arquivo ato notarial"
            data-umami-event-chave={key}
            rel="noopener"
          >
            <Badge className="flex gap-2 bg-zinc-300 py-1 text-blue-600 text-sm underline hover:bg-zinc-100">
              <Download />
              {filename}
            </Badge>
          </a>
        </CardFooter>
      )}
    </Card>
  )
}
