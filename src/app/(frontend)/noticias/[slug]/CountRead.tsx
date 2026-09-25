'use client'

import { useEffect } from 'react'
import { countReadAction } from './countReadAction'

export function CountRead({ articleId }: { articleId: string }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Fire and forget: a request lost to a closed tab or dropped connection only costs one
      // count, so it must not surface as an unhandled rejection.
      countReadAction({
        articleId,
      }).catch(() => {})
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [articleId])
  return null
}
