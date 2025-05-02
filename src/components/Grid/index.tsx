import { cn } from '@/utilities/ui'

type Props = {
  children: React.ReactNode
  className?: string
}

export function Grid(props: Props) {
  const { children, className } = props

  return (
    <div className={cn('grid grid-cols-1 gap-x-10 lg:grid-cols-12', className)}>{children}</div>
  )
}

export function GridLeft(props: Props) {
  const { children, className } = props

  return <div className={cn('col-span-1 lg:col-span-8', className)}>{children}</div>
}

export function GridRight(props: Props) {
  const { children, className } = props

  return <div className={cn('col-span-1 lg:col-span-4', className)}>{children}</div>
}

export function GridFull(props: Props) {
  const { children, className } = props

  return <div className={cn('col-span-1 lg:col-span-12', className)}>{children}</div>
}
