import type React from 'react'
import { COLLECTION_URL_PATHS } from '@/constants'
import { buildPageMetadata } from '@/utilities/buildPageMetadata'

export default async function PageLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return children
}

export const generateMetadata = () =>
  buildPageMetadata({ title: 'Notícias', path: COLLECTION_URL_PATHS.News })
