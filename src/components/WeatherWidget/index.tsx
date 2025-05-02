'use client'

import { useEffect } from 'react'
import { Card } from '../ui/card'

export function WeatherWidget() {
  useEffect(() => {
    const id = 'tomorrow-sdk'

    if (document.getElementById(id)) {
      // @ts-expect-error no error
      if (window.__TOMORROW__) {
        // @ts-expect-error no error
        window.__TOMORROW__.renderWidget()
      }
      return
    }

    const fjs = document.getElementsByTagName('script')[0]
    const js = document.createElement('script')
    js.id = id
    js.src = 'https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js'

    fjs.parentNode?.insertBefore(js, fjs)
  }, [])

  return (
    <Card className="bg-accent p-3">
      <div
        className="tomorrow"
        data-location-id="010153"
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
