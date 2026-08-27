import NextImage, { type StaticImageData } from 'next/image'
import type React from 'react'
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
    src: srcFromProps,
    loading: loadingFromProps,
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''

    const cacheTag = resource.updatedAt

    src = `${url}?${cacheTag}`
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

  return (
    <picture className={cn(pictureClassName)}>
      <NextImage
        alt={alt ?? 'Image'}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height! : undefined}
        priority={priority}
        quality={100}
        src={src}
        loading={loading}
        width={!fill ? width! : undefined}
      />
    </picture>
  )
}
