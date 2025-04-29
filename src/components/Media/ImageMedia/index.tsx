import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

import { getClientSideURL } from '@/utilities/getURL'

export const ImageMedia: React.FC<MediaProps> = (props) => {
  if (typeof props.resource === 'number' || typeof props.resource === 'string') return null

  const { fill, imgClassName, resource } = props
  const { alt, height, filename, width, updatedAt } = resource

  const cacheTag = updatedAt
  const src = `${getClientSideURL()}/media/${filename}?${cacheTag}`

  return (
    <picture>
      <NextImage
        alt={alt}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height! : undefined}
        quality={100}
        src={src}
        width={!fill ? width! : undefined}
      />
    </picture>
  )
}
