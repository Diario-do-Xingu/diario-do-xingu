'use client'

import { useEffect, useState } from 'react'
import { formatDateAndRelative, formatDateWithTime } from '@/utilities/formatDate'

/**
 * Publication date, with "há N horas" appended once the page is on the client.
 *
 * The absolute part is fixed to São Paulo time, so server and browser agree on it and it can be
 * in the HTML from the start. The relative part depends on the reader's clock, so it only appears
 * after mount. Rendering nothing until then, as this once did, inserted a line after hydration
 * and pushed the whole article down: the largest layout shift Sentry measured on the page.
 */
export function RelativePublishedAt(props: { publishedAt: string }) {
  const [label, setLabel] = useState(() => formatDateWithTime(props.publishedAt))

  useEffect(() => {
    setLabel(formatDateAndRelative(props.publishedAt))
  }, [props.publishedAt])

  return <time dateTime={props.publishedAt}>{label}</time>
}
