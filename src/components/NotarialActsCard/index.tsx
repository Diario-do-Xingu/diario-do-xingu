import { Download, Calendar, KeyRound, ExternalLink } from 'lucide-react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { NotarialAct } from '@/payload-types'

import Link from 'next/link'
import { getClientSideURL } from '@/utilities/getURL'
import { COLLECTION_URL_PATHS } from '@/constants'
import { env } from '@/env'
import { formatDateTime } from '@/utilities/formatDate'

export type NotarialActData = Pick<
  NotarialAct,
  'heading' | 'content' | 'filename' | 'key' | 'publishedAt'
>

type NotarialActsCardProps = {
  doc: NotarialActData
}

export function NotarialActsCard(props: NotarialActsCardProps) {
  const { doc } = props

  const { content, heading, filename, key, publishedAt } = doc

  const linkFeatureEnabled = env.NEXT_PUBLIC_FEATURE_NOTARIAL_ACT_LINK

  const href = linkFeatureEnabled
    ? `${getClientSideURL()}/${COLLECTION_URL_PATHS.NotarialActs}/${doc.key}`
    : '#'

  const downloadLink = `${getClientSideURL()}/notarial-acts/${filename}`
  return (
    <Card className="bg-[#F8F8F8] transition-all hover:scale-[100.2%] hover:bg-card hover:shadow-xl">
      <Link href={href}>
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
              {formatDateTime(publishedAt!)}
            </Badge>

            <Badge className="flex gap-2 text-sm">
              <KeyRound className="size-4" />
              {`Chave: ${key}`}
            </Badge>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex flex-col items-stretch gap-2">
        <a href={downloadLink} target="_blank">
          <Badge className="flex gap-2 bg-zinc-300 py-1 text-sm text-blue-600 underline hover:bg-zinc-100">
            <Download />
            {filename}
          </Badge>
        </a>
      </CardFooter>
    </Card>
  )
}
