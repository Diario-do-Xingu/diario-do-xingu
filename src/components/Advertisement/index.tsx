import Link from 'next/link'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Card } from '@/components/ui/card'
import { COLLECTION_SLUGS } from '@/constants'
// biome-ignore lint/style/useImportType: AdType is a runtime const; `typeof AdTypes` below needs the value binding.
import { AdType as AdTypes } from '@/payload/globals/Advertisement'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { imageVariant } from '@/utilities/imageVariant'
import { cn } from '@/utilities/ui'

type AdType = (typeof AdTypes)[keyof typeof AdTypes]

type AdvertisementProps = {
  adType: AdType
  containerClassName?: string
  imgClassName?: string
}

export async function Advertisement(props: AdvertisementProps) {
  const { adType, containerClassName, imgClassName } = props

  const advertisementGlobal = await getCachedGlobal(COLLECTION_SLUGS.Advertisement, 2)()

  const advertisement = advertisementGlobal[adType]?.[0]
  const image = advertisement?.image
  const link = advertisement?.link

  // An unpopulated upload (a bare ID) has nothing to render, same as an empty slot
  if (!image || typeof image !== 'object') return null

  // The top banner is laid out at the width of the variant actually served: the old max-content
  // wrapper sized it from the srcset candidate's density and shrank it to a third once `sizes` was set.
  const bannerWidth = adType === 'topAdsBanner' ? imageVariant(image, 'hero').width : undefined

  const imageComponent = (
    <ImageMedia
      resource={image}
      imgClassName={cn('w-full rounded-lg', imgClassName)}
      sizes={
        adType === 'topAdsBanner'
          ? bannerWidth
            ? `(min-width: ${bannerWidth}px) ${bannerWidth}px, 100vw`
            : '(min-width: 1280px) 1216px, 100vw'
          : '(min-width: 1024px) 400px, 100vw'
      }
    />
  )
  const component = link ? <Link href={link}>{imageComponent}</Link> : <div>{imageComponent}</div>

  return (
    <Card
      className={cn('bg-[#F8F8F8] p-3', containerClassName, {
        'topAdsBanner w-full': adType === 'topAdsBanner',
      })}
      // 10px = the p-1 frame the layout passes for the top banner plus the card border, both sides.
      style={bannerWidth ? { maxWidth: bannerWidth + 10 } : undefined}
    >
      {component}
    </Card>
  )
}
