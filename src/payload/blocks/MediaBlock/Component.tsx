import { ImageMedia } from '@/components/Media/ImageMedia'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = MediaBlockProps & {
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  caption?: string | null
}

export function MediaBlock(props: Props) {
  const { captionClassName, className, enableGutter = true, imgClassName, media, caption } = props

  return (
    <div
      className={cn(
        'container flex flex-col items-center gap-1 text-center',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      <ImageMedia
        resource={media}
        pictureClassName="m-0"
        imgClassName={cn('rounded-lg', imgClassName)}
      />
      {caption && <span className={cn('text-xs text-zinc-600', captionClassName)}>{caption}</span>}
    </div>
  )
}
