import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { type ButtonProps, buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="Paginação"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  ),
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />,
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  /** Without an href the item is unavailable: dimmed, inert text rather than a link. */
  href?: string
} & Pick<ButtonProps, 'size'> &
  Omit<React.ComponentProps<typeof Link>, 'href'>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  href,
  children,
  ...props
}: PaginationLinkProps) => {
  const classes = cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }), className)

  if (!href) {
    return <span className={cn(classes, 'pointer-events-none opacity-50')}>{children}</span>
  }

  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined} className={classes} {...props}>
      {children}
    </Link>
  )
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({ className, ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Ir para a página anterior"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Anterior</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Ir para a próxima página"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Próxima</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <Ellipsis className="h-4 w-4" />
    <span className="sr-only">Mais páginas</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
