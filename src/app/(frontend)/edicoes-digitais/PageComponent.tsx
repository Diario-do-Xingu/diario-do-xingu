import { DigitalEdition } from '@/payload-types'
import { PaginatedDocs } from 'payload'
import { Advertisement } from '@/components/Advertisement'
import { ArticleHighlightSection } from '@/components/ArticleHighlightSection'
import { ArticleMostReadSection } from '@/components/ArticleMostReadSection'
import { DigitalEditionsSection } from '@/components/DigitalEditions/DigitalEditionsSection'
import { Grid, GridFull, GridLeft, GridRight } from '@/components/Grid'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Pagination } from '@/components/Pagination'
import { SoccerWidget } from '@/components/SoccerWidget'
import { WeatherWidget } from '@/components/WeatherWidget'
import { COLLECTION_URL_PATHS } from '@/constants'
import Link from 'next/link'

type PageComponentProps = {
  digitalEditions: PaginatedDocs<DigitalEdition>
}

export function DigitalEditionsPageComponent({ digitalEditions }: PageComponentProps) {
  const { docs } = digitalEditions

  return (
    <Grid className="container-y-padding container gap-10">
      <GridFull>
        <h2 className="text-primary">Edições Digitais</h2>
        <div className="mt-2 h-px bg-foreground"></div>
      </GridFull>

      <GridLeft>
        <div className="grid gap-8 md:grid-cols-3 xl:grid-cols-4">
          {docs.map((edition) => {
            return (
              <Link
                href={edition.url ?? ''}
                target="_blank"
                key={edition.id}
                className="flex flex-col gap-4 overflow-hidden rounded bg-white p-2 transition-transform hover:scale-[103%]"
              >
                <div className="flex-1 overflow-hidden md:max-h-64">
                  <ImageMedia
                    resource={edition.thumb}
                    imgClassName="object-contain h-full w-full"
                  />
                </div>

                <div className="mt-auto px-2 pb-2">
                  <span className="font-globo text-xl font-bold text-red-500">
                    {edition['digital-edition-name']}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {digitalEditions.totalPages > 1 && digitalEditions.page && (
          <Pagination
            path={COLLECTION_URL_PATHS.DigitalEditions}
            page={digitalEditions.page}
            totalPages={digitalEditions.totalPages}
            className="mt-8"
          />
        )}
      </GridLeft>

      <GridRight className="space-y-5">
        <ArticleHighlightSection />
        <WeatherWidget />
        <ArticleMostReadSection />
        <DigitalEditionsSection />
        <Advertisement />
        <SoccerWidget />
      </GridRight>
    </Grid>
  )
}
