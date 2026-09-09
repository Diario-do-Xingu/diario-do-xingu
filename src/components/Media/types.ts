import type { StaticImageData } from 'next/image'

import type { Media as MediaType } from '@/payload-types'
import type { ImageVariant } from '@/utilities/imageVariant'

export interface Props {
  alt?: string
  fill?: boolean // for NextImage only
  pictureClassName?: string
  imgClassName?: string
  loading?: 'lazy' | 'eager' // for NextImage only
  priority?: boolean // for NextImage only
  resource?: MediaType | string | number | null // for Payload media
  /** Generated variant to serve instead of the original upload. */
  variant?: ImageVariant
  /** The `sizes` attribute, so the browser picks a fitting srcset entry instead of the largest. */
  sizes?: string
  src?: StaticImageData // for static media
}
