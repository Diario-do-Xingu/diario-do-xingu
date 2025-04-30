import type { Media as MediaType } from '@/payload-types'

export interface Props {
  fill?: boolean // for NextImage only
  // htmlElement?: ElementType | null
  // pictureClassName?: string
  imgClassName?: string
  alt?: string
  // onClick?: () => void
  // onLoad?: () => void
  // loading?: 'lazy' | 'eager' // for NextImage only
  // priority?: boolean // for NextImage only
  // ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource: MediaType | string | number // for Payload media
  // src?: StaticImageData // for static media
  // videoClassName?: string
}
