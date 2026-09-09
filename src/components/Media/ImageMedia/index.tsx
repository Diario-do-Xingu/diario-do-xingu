import NextImage, { type StaticImageData } from 'next/image'
import type React from 'react'
import { imageVariant } from '@/utilities/imageVariant'
import { cn } from '@/utilities/ui'

import type { Props as MediaProps } from '../types'

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    sizes,
    src: srcFromProps,
    loading: loadingFromProps,
    variant = 'hero',
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const picked = imageVariant(resource, variant)
    width = picked.width
    height = picked.height
    alt = altFromProps || resource.alt || ''

    const cacheTag = resource.updatedAt

    src = `${picked.src}?${cacheTag}`
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

  return (
    <picture className={cn(pictureClassName)}>
      <NextImage
        alt={alt ?? 'Image'}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        priority={priority}
        sizes={sizes}
        src={src}
        loading={loading}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
