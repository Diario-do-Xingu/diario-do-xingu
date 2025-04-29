import React from 'react'

import { Card } from '@/components/ui/card'
import { WeatherWidget } from '@/components/WeatherWidget'
import { SoccerWidget } from '@/components/SoccerWidget'
import { Advertisement } from '@/components/Advertisement'

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10">
      {children}

      <div className="col-span-1 flex flex-col gap-4 lg:col-span-4">
        <Card className="bg-[#F8F8F8] p-3">
          <WeatherWidget />
        </Card>

        <Card className="bg-[#F8F8F8] p-3">
          <SoccerWidget />
        </Card>

        <Advertisement />
      </div>
    </div>
  )
}
