'use client'

import { formatDateAndRelative } from '@/utilities/formatDate'
import { useEffect, useState } from 'react'

export function PublishedAtClient(props: { publishedAt: string }) {
  const [string, setString] = useState('')

  useEffect(() => {
    setString(formatDateAndRelative(props.publishedAt))
  }, [props.publishedAt])

  return string
}
