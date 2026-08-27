'use client'

import { useEffect, useState } from 'react'
import { formatDateAndRelative } from '@/utilities/formatDate'

export function RelativePublishedAtClient(props: { publishedAt: string }) {
  const [publishedAt, setPublishedAt] = useState<string | null>(null)

  useEffect(() => {
    setPublishedAt(props.publishedAt)
  }, [props.publishedAt])

  return publishedAt && <time dateTime={publishedAt}>{formatDateAndRelative(publishedAt)}</time>
}
