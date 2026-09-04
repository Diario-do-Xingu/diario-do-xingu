'use client'

import { Button } from '@/components/ui/button'

// Client error boundary for the public site; keeps the header and footer around the failure.
export default function ErrorPage(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { reset } = props

  return (
    <section className="container-y-padding container flex flex-col items-center gap-5 text-center">
      <h1 className="text-2xl text-primary">Algo deu errado</h1>
      <p className="max-w-prose text-zinc-600">
        Não foi possível carregar esta página. Tente novamente em instantes.
      </p>
      <Button className="font-semibold" onClick={reset}>
        Tentar novamente
      </Button>
    </section>
  )
}
