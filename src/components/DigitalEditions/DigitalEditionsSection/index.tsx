import { ImageMedia } from '@/components/Media/ImageMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import Link from 'next/link'
import { Fragment } from 'react'

export async function DigitalEditionsSection() {
  const payload = await getPayload()

  const digitalEditions = await payload.find({
    collection: COLLECTION_SLUGS.DigitalEditions,
    limit: 4,
    pagination: false,
  })

  const { docs, totalDocs } = digitalEditions

  return (
    <Card className="mt-10 bg-tertiary p-4">
      <CardHeader className="rounded-tl-default rounded-tr-default border-b-2 bg-card py-4">
        <Link href={COLLECTION_URL_PATHS.DigitalEditions}>
          <h4 className="text-md font-globo font-bold text-primary underline">Edições Digitais</h4>
        </Link>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 rounded-bl-default rounded-br-default bg-card pt-5">
        {docs.map((item, index) => {
          return (
            <Fragment key={item.slug}>
              <Link
                href={item.url || ''}
                target="_blank"
                className="flex items-center gap-5 transition-transform hover:scale-[102%]"
              >
                <div className="aspect-square size-36">
                  <ImageMedia resource={item.thumb} imgClassName="h-full object-contain" />
                </div>

                <div className="flex-1 font-bold text-red-700">{item['digital-edition-name']}</div>
              </Link>

              {index < totalDocs - 1 && <div className="divider h-[1px] bg-zinc-300"></div>}
            </Fragment>
          )
        })}
      </CardContent>
    </Card>
  )
}
