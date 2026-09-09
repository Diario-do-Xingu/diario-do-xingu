'use client'

import { useSyncExternalStore } from 'react'
import { writingDate } from '@/utilities/formatDate'

const DAY = 24 * 60 * 60 * 1000
const SAO_PAULO_OFFSET = 3 * 60 * 60 * 1000 // UTC-3, no daylight saving since 2019

// Re-render at the next São Paulo midnight, then keep re-arming, so a tab left open rolls over.
const subscribe = (onChange: () => void) => {
  let timer: ReturnType<typeof setTimeout>
  const arm = () => {
    const sinceMidnight = (Date.now() - SAO_PAULO_OFFSET) % DAY
    timer = setTimeout(() => {
      onChange()
      arm()
    }, DAY - sinceMidnight)
  }
  arm()
  return () => clearTimeout(timer)
}

// Rendered only on the client: the server snapshot is empty, so there is nothing to mismatch
// when the server's clock is on another day.
export function DisplayDate() {
  return useSyncExternalStore(
    subscribe,
    () => writingDate(Date.now()),
    () => '',
  )
}
