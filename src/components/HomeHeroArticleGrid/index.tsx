import { cn } from '@/utilities/ui'
import { HomeHeroArticleCard } from '../HomeHeroArticleCard'
import { getPayload } from '@/lib/payload/getPayload'
import { COLLECTION_SLUGS } from '@/constants'

export async function HomeHeroArticleGrid() {
  const payload = await getPayload()

  const heroNews = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: 3,
    sort: '-publishedAt',
    overrideAccess: false,
    select: {
      heading: true,
      subheading: true,
      heroImage: true,
      category: true,
      highligh: true,
      slug: true,
    },
  })

  const { docs, totalDocs } = heroNews

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
          size={totalDocs < 3 ? 'lg' : i === 0 ? 'lg' : 'sm'}
          doc={doc}
        />
      ))}
    </div>
  )
}
