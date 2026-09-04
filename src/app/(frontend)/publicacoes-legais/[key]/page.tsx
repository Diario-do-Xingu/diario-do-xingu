import { ArrowLeft, Calendar, Download, KeyRound } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { GridLeft } from '@/components/Grid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import { formatDateWithTime } from '@/utilities/formatDate'
import { excerpt } from '@/utilities/formatString'
import { getSiteMeta } from '@/utilities/getSiteMeta'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

// Same 10-minute window as the list routes, so the layout around this page (ads, widgets)
// is not frozen at generation time until the notice itself is republished.
export const revalidate = 600

type Args = {
  params: Promise<{
    key?: string
  }>
}

// Shared by generateMetadata and the page so the notice is queried once per request.
// Anonymous visitors only see published notices (overrideAccess: false).
const findNotarialAct = cache(async (key: string) => {
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

  return notarialAct
})

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { key = '' } = await params
  const notarialAct = await findNotarialAct(key)

  if (!notarialAct) return {}

  const { siteName, siteDescription, images } = await getSiteMeta()

  const title = notarialAct.heading
  const description = excerpt(notarialAct.content) || siteDescription
  const url = `/${COLLECTION_URL_PATHS.NotarialActs}/${notarialAct.key}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: mergeOpenGraph({
      type: 'article',
      siteName,
      title,
      description,
      url,
      images,
      publishedTime: notarialAct.publishedAt ?? undefined,
      modifiedTime: notarialAct.updatedAt,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

export default async function Page({ params: paramsPromise }: Args) {
  const { key = '' } = await paramsPromise
  const notarialAct = await findNotarialAct(key)

  if (!notarialAct) notFound()

  return (
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
      <div className="mt-2 mb-4 h-px bg-foreground"></div>

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
            rel="noopener"
          >
            <Badge className="flex gap-2 bg-zinc-300 py-1 text-blue-600 text-sm underline hover:bg-zinc-100">
              <Download />
              {notarialAct.filename}
            </Badge>
          </a>
        )}
      </div>
    </GridLeft>
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
