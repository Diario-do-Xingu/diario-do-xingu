import { Media, News } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { Badge } from '../ui/badge'

type HomeNewsHeroCardProps = {
  size: 'lg' | 'sm'
  doc: Pick<News, 'heading' | 'subheading' | 'heroImage'>
  index: number
}

const colors = ['secondary', 'accent', 'tertiary'] as const

export function HomeNewsHeroCard(props: HomeNewsHeroCardProps) {
  const { size, doc, index } = props

  const image = doc.heroImage.image as Media
  const imageAlt = doc.heroImage.description || image.alt || ''

  return size === 'lg' ? (
    <Card
      className={cn(
        'group relative col-span-1 row-span-2 min-h-[300px] max-w-4xl overflow-hidden bg-transparent shadow-none lg:min-h-[auto]',
      )}
    >
      <Image
        alt={imageAlt}
        className="absolute -z-10 h-full w-full object-cover brightness-[40%] transition-transform duration-300 group-hover:scale-[105%]"
        height={image.height!}
        quality={100}
        src={image.url!}
        width={image.width!}
      />

      <CardContent className="flex h-full flex-col gap-3 p-5 pb-10 text-white">
        <Badge className="w-max text-sm font-bold" variant={colors[index % colors.length]}>
          {`'Ozempic de rico'`}
        </Badge>

        <div className="flex flex-1 flex-col justify-center">
          <h3 className="mt-6 text-3xl font-bold leading-tight">{doc.heading}</h3>

          {doc.subheading && (
            <p className="text-md mt-4 font-bold text-zinc-100 shadow-sm">{doc.subheading}</p>
          )}
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="group relative col-span-1 row-span-1 min-h-[300px] overflow-hidden bg-transparent shadow-none lg:min-h-[auto]">
      <Image
        alt={imageAlt}
        className="absolute -z-10 h-full w-full object-cover brightness-[40%] transition-transform duration-300 group-hover:scale-[105%]"
        height={image.height!}
        quality={100}
        src={image.url!}
        width={image.width!}
      />

      <CardContent className="flex h-full flex-col justify-between gap-16 p-5 pb-7 text-white">
        <Badge className="w-max text-sm font-bold" variant={colors[index % colors.length]}>
          {`'Ozempic de rico'`}
        </Badge>

        <div className="flex flex-1 flex-col items-center">
          <h3 className="text-xl font-bold leading-tight">{doc.heading}</h3>

          {doc.subheading && (
            <p className="text-md mt-4 font-semibold text-zinc-100">{doc.subheading}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
