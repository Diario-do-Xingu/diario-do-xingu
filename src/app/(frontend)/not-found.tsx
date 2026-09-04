import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Página não encontrada',
}

// Rendered inside the site layout for notFound() calls and unmatched URLs.
export default function NotFound() {
  return (
    <section className="container-y-padding container flex flex-col items-center gap-5 text-center">
      <p className="font-bold font-globo text-7xl text-primary">404</p>
      <h1 className="text-2xl text-primary">Página não encontrada</h1>
      <p className="max-w-prose text-zinc-600">
        A página que você procura não existe ou foi removida.
      </p>
      <Button asChild className="font-semibold">
        <Link href="/">Voltar para a página inicial</Link>
      </Button>
    </section>
  )
}
