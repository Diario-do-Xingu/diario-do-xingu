import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'

/**
 * Page links for a list route. Page 1 is the list root; later pages go to the static
 * `/${path}/page/N`, unless `query` (a serialized filter, without `page`) is set: then they go
 * to `/${path}?${query}&page=N`.
 */
type PaginationProps = {
  className?: string
  page: number
  totalPages: number
  path: string
  query?: string
}

export function Pagination({ className, page, totalPages, path, query }: PaginationProps) {
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  const hrefFor = (n: number) => {
    if (n === 1) return query ? `/${path}?${query}` : `/${path}`
    return query ? `/${path}?${query}&page=${n}` : `/${path}/page/${n}`
  }

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent className="justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={hasPrevPage ? hrefFor(page - 1) : undefined} />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink href={hrefFor(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive href={hrefFor(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink href={hrefFor(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext href={hasNextPage ? hrefFor(page + 1) : undefined} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
