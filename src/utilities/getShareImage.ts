import { Media, SiteMetadatum } from '@/payload-types'
import { getCachedGlobal } from './getGlobals'
import { getPayload } from '@/lib/payload/getPayload'

export async function getShareImageUrl() {
  const metadata = (await getCachedGlobal('site-metadata')()) as SiteMetadatum
  const cardShareImage = metadata.cardShareImage
  let shareImage = cardShareImage as Media

  if (typeof cardShareImage === 'number') {
    shareImage = await (
      await getPayload()
    ).findByID({
      collection: 'media',
      id: cardShareImage,
    })
  }

  return shareImage
}
