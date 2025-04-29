import React from 'react'
import './globals.css'

import { Open_Sans, Varela_Round } from 'next/font/google'
import { cn } from '@/utilities/ui'
import { WEBSITE_TITLE } from '@/constants'

export const metadata = {
  description: `${WEBSITE_TITLE}`,
  title: WEBSITE_TITLE,
}

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-open-sans',
})
const varelaRound = Varela_Round({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-varela-round',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={cn(openSans.variable, varelaRound.variable)}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
