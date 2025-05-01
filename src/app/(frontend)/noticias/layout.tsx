import React from 'react'

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return <div className="container grid grid-cols-1 gap-10 lg:grid-cols-12">{children}</div>
}
