'use client'

import { useEffect, useState } from 'react'
import { writingDate } from '@/utilities/formatDate'

export function DisplayDate() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date()) // Update the state with a new Date object
    }, 1000) // Update every second

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  return writingDate(date.getTime())
}
