'use client'

import { useEffect } from 'react'
import { countReadAction } from './countReadAction'

export function CountRead({
  articleId,
  currentReadCount,
}: {
  articleId: string
  currentReadCount: number
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      countReadAction({
        articleId,
        currentReadCount,
      })
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [currentReadCount, articleId])
  return null
}
