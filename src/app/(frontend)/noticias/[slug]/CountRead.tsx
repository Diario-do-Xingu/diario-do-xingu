'use client'

import { useEffect } from 'react'
import { countReadAction } from './countReadAction'

export function CountRead({ articleId }: { articleId: string }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      countReadAction({
        articleId,
      })
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [articleId])
  return null
}
