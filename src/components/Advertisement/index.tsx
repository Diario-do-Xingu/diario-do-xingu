import { getCachedGlobal } from '@/utilities/getGlobals'
import { ImageMedia } from '../Media/ImageMedia'
import { Advertisement as AdvertisementType, Media } from '@/payload-types'
import Link from 'next/link'
import { Card } from '../ui/card'
import { COLLECTION_SLUGS } from '@/constants'

export async function Advertisement() {
  const { sideBarAdvertisement } = (await getCachedGlobal(
    COLLECTION_SLUGS.Advertisement,
    1,
  )()) as AdvertisementType

  if (!sideBarAdvertisement || !sideBarAdvertisement.image) return null

  const { image, link } = sideBarAdvertisement

  const imageComponent = <ImageMedia resource={image as Media} imgClassName="w-full" />
  const component = link ? <Link href={link}>{imageComponent}</Link> : <div>{imageComponent}</div>

  return <Card className="lg:sticky top-40 bg-[#F8F8F8] p-3">{component}</Card>
}
