import type { News } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { HomeHeroArticleCard } from '../HomeHeroArticleCard'

export async function HomeHeroArticleGrid({ docs }: { docs: News[] }) {
  return (
    <div
      className={cn(
        'container grid grid-cols-1 gap-4 xl:max-w-7xl',
        'lg:grid-cols-2 lg:grid-rows-2',
      )}
    >
      {docs.map((doc, i) => (
        <HomeHeroArticleCard
          key={i}
          index={i}
          size={docs.length < 3 ? 'lg' : i === 0 ? 'lg' : 'sm'}
          doc={doc}
        />
      ))}
    </div>
  )
}
