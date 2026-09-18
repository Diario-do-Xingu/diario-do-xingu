'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { TOMORROW_WIDGET } from '@/constants'

declare global {
  interface Window {
    /** Set by the Tomorrow.io SDK once it has loaded. */
    __TOMORROW__?: { renderWidget: () => void }
  }
}

export function WeatherWidget() {
  useEffect(() => {
    const id = 'tomorrow-sdk'

    // The SDK only scans for widgets on load, so a second mount has to ask it to render again.
    if (document.getElementById(id)) {
      window.__TOMORROW__?.renderWidget()
      return
    }

    const fjs = document.getElementsByTagName('script')[0]
    const js = document.createElement('script')
    js.id = id
    js.src = TOMORROW_WIDGET.SdkUrl

    fjs.parentNode?.insertBefore(js, fjs)
  }, [])

  return (
    <Card className="bg-accent p-3">
      <div
        className="tomorrow"
        data-location-id={TOMORROW_WIDGET.LocationId}
        data-language="PT"
        data-unit-system="METRIC"
        data-skin="light"
        data-widget-type="upcoming"
        style={{
          paddingBottom: '22px',
          position: 'relative',
        }}
      />
    </Card>
  )
}
