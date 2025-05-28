'use client'

import { formatDateAndRelative } from '@/utilities/formatDate'
import { useEffect, useState } from 'react'

export function RelativePublishedAtClient(props: { publishedAt: string }) {
  const [publishedAt, setPublishedAt] = useState<string | null>(null)

  useEffect(() => {
    setPublishedAt(props.publishedAt)
  }, [props.publishedAt])

  return publishedAt && <time dateTime={publishedAt}>{formatDateAndRelative(publishedAt)}</time>
}
