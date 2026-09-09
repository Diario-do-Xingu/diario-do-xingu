'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

// Last-resort boundary: catches failures inside a root layout itself, where the (frontend)
// error page cannot run. It has to render its own <html> and <body>.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body
        style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '4rem 1rem' }}
      >
        <h1>Algo deu errado</h1>
        <p>Não foi possível carregar o site. Tente novamente em instantes.</p>
      </body>
    </html>
  )
}
