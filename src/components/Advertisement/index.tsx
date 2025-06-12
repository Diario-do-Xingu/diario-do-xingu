import { getCachedGlobal } from '@/utilities/getGlobals'
import { ImageMedia } from '../Media/ImageMedia'
import { Advertisement as AdvertisementType, Media } from '@/payload-types'
import Link from 'next/link'
import { Card } from '../ui/card'
import { COLLECTION_SLUGS } from '@/constants'
import { AdType } from '@/payload/globals/Advertisement'
import { cn } from '@/utilities/ui'

type AdType = (typeof AdType)[keyof typeof AdType]

type AdvertisementProps = {
  adType: AdType
  containerClassName?: string
  imgClassName?: string
}

export async function Advertisement(props: AdvertisementProps) {
  const { adType, containerClassName, imgClassName } = props

  const advertisementGlobal = (await getCachedGlobal(
    COLLECTION_SLUGS.Advertisement,
    2,
  )()) as AdvertisementType

  const advertisement = advertisementGlobal[adType]?.[0]

  if (!advertisement || !advertisement.image) return null

  const { image, link } = advertisement

  const imageComponent = (
    <ImageMedia resource={image as Media} imgClassName={cn('w-full rounded-lg', imgClassName)} />
  )
  const component = link ? <Link href={link}>{imageComponent}</Link> : <div>{imageComponent}</div>

  return (
    <Card
      className={cn('bg-[#F8F8F8] p-3', containerClassName, {
        topAdsBanner: adType === 'topAdsBanner',
      })}
    >
      {component}
    </Card>
  )
}
