import { GridLeft } from '@/components/Grid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { formatDateWithTime } from '@/utilities/formatDate'
import { ArrowLeft, Calendar, Download, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type Args = {
  params: Promise<{
    key?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { key = '' } = await paramsPromise
  const payload = await getPayload()

  const {
    docs: [notarialAct],
  } = await payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      key: {
        equals: key,
      },
    },
  })

  if (!notarialAct) return redirect('/')

  return (
    <>
      <GridLeft>
        <Button asChild className="mb-5 font-semibold">
          <Link href={`/${COLLECTION_URL_PATHS.NotarialActs}`}>
            <ArrowLeft />
            Voltar
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <h2 className="text-primary">{notarialAct.heading}</h2>
        </div>
        <div className="mb-4 mt-2 h-px bg-foreground"></div>

        <p className="font-medium leading-relaxed">{notarialAct.content}</p>

        <div className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col items-start gap-2 md:flex-row">
            <Badge variant="secondary" className="flex gap-2 text-sm">
              <Calendar className="size-4" />
              {formatDateWithTime(notarialAct.publishedAt!, ' -')}
            </Badge>

            <Badge className="flex gap-2 text-sm">
              <KeyRound className="size-4" />
              {`Chave: ${key}`}
            </Badge>
          </div>

          {notarialAct.url && (
            <a
              href={notarialAct.url}
              target="_blank"
              data-umami-event="Abrir arquivo ato notarial"
              data-umami-event-chave={key}
            >
              <Badge className="flex gap-2 bg-zinc-300 py-1 text-sm text-blue-600 underline hover:bg-zinc-100">
                <Download />
                {notarialAct.filename}
              </Badge>
            </a>
          )}
        </div>
      </GridLeft>
    </>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: COLLECTION_SLUGS.NotarialActs,
    overrideAccess: false,
    draft: false,
    limit: 100,
    pagination: false,
    select: {
      key: true,
    },
  })

  const params = docs.map(({ key }) => ({ key }))

  return params
}
