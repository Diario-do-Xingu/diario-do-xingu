import { Advertisement } from '@/components/Advertisement'
import { DigitalEditionsSection } from '@/components/DigitalEditions/DigitalEditionsSection'
import { GridRight } from '@/components/Grid'
import { NewsSidebarCard } from '@/components/NewsSidebarCard'
import { SoccerWidget } from '@/components/SoccerWidget'
import { WeatherWidget } from '@/components/WeatherWidget'
import { ARCHIVE_LIMIT } from '@/constants'
import { cn } from '@/utilities/ui'

/** The right-hand column shared by the home page, both list pages and the article page. */
export function Sidebar({ className }: { className?: string }) {
  return (
    <GridRight className={cn('space-y-5', className)}>
      <NewsSidebarCard
        title="Destaques"
        limit={ARCHIVE_LIMIT.Highlights}
        sort="-publishedAt"
        where={{ showInHighlights: { equals: true } }}
      />
      <WeatherWidget />
      <NewsSidebarCard title="Mais Lidas" limit={ARCHIVE_LIMIT.MostRead} sort="-readCount" />
      <DigitalEditionsSection />
      <Advertisement adType="firstSideAdsBanner" />
      <SoccerWidget />
      <Advertisement adType="secondSideAdsBanner" />
    </GridRight>
  )
}
