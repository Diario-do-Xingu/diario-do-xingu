'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
  children: React.ReactNode
  containerId?: string // optional container ID
}

export const Portal = ({ children, containerId = 'portal-root' }: PortalProps) => {
  const [mounted, setMounted] = useState(false)

  console.log(mounted)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const container = document.getElementById(containerId)

  console.log(container)
  return container ? createPortal(children, container) : null
}
