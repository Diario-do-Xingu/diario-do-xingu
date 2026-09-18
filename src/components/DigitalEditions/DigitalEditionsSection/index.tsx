import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { Fragment } from 'react'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS, SIDEBAR_TAGS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'

/**
 * The latest editions are the same on every page that renders the sidebar, so the read is
 * cached and busted by the collection's own revalidate hook.
 */
const loadEditions = unstable_cache(
  async () => {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: COLLECTION_SLUGS.DigitalEditions,
      limit: 4,
      pagination: false,
    })
    return docs
  },
  ['digital-editions-sidebar'],
  { tags: [SIDEBAR_TAGS.DigitalEditions], revalidate: 600 },
)

export async function DigitalEditionsSection() {
  const docs = await loadEditions()

  return (
    <Card className="bg-tertiary p-4">
      <CardHeader className="rounded-tl-default rounded-tr-default border-b-2 bg-card py-4">
        <Link href={`/${COLLECTION_URL_PATHS.DigitalEditions}`}>
          <h3 className="font-bold font-globo text-md text-primary underline">Edições Digitais</h3>
        </Link>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 rounded-br-default rounded-bl-default bg-card pt-5">
        {docs.map((item, index) => {
          return (
            <Fragment key={item.slug}>
              <Link
                href={item.url || ''}
                target="_blank"
                className="flex items-center gap-5 transition-transform hover:scale-[102%]"
              >
                <div className="aspect-square size-36">
                  {/* Digital-edition thumbnails have no generated variants; the original is 500px. */}
                  <ImageMedia
                    resource={item.thumb}
                    alt={item.name}
                    imgClassName="h-full object-contain"
                    sizes="144px"
                  />
                </div>

                <div className="flex-1 font-bold text-red-700">{item.name}</div>
              </Link>

              {index < docs.length - 1 && <div className="divider h-px bg-zinc-300"></div>}
            </Fragment>
          )
        })}
      </CardContent>
    </Card>
  )
}
