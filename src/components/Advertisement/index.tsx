import { getCachedGlobal } from '@/utilities/getGlobals'
import { ImageMedia } from '../Media/ImageMedia'
import { Advertisement as AdvertisementType, Media } from '@/payload-types'
import Link from 'next/link'
import { Card } from '../ui/card'
import { COLLECTION_SLUGS } from '@/constants'

export async function Advertisement() {
  const advertisement = (await getCachedGlobal(
    COLLECTION_SLUGS.Advertisement,
    2,
  )()) as AdvertisementType

  if (!advertisement.sideBarAdvertisement || !advertisement.sideBarAdvertisement.image) return null

  const { image, link } = advertisement.sideBarAdvertisement

  const imageComponent = <ImageMedia resource={image as Media} imgClassName="w-full rounded-lg" />
  const component = link ? <Link href={link}>{imageComponent}</Link> : <div>{imageComponent}</div>

  return <Card className="top-36 z-10 bg-[#F8F8F8] p-3">{component}</Card>
}
