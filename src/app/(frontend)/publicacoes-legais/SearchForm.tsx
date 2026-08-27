'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utilities/ui'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialKey = searchParams.get('key') || ''
  const initialDate = searchParams.get('date') || ''

  const [key, setKey] = useState(initialKey)
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : undefined,
  )

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (key) params.set('key', key)
    if (date) params.set('date', date.toISOString())

    router.push(`/publicacoes-legais?${params.toString()}`)
  }

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`?`)
    setKey('')
    setDate(undefined)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-2">
      <div className="flex flex-col gap-4 lg:flex-row">
        <Input
          className="bg-white"
          type="text"
          placeholder="Chave"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className={cn('w-full', !date && 'text-muted-foreground')}>
              {date ? (
                format(date, 'PPP', {
                  locale: ptBR,
                })
              ) : (
                <span>Selecione uma data</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              locale={ptBR}
              onSelect={(e) => {
                setDate(e)
              }}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="">
        Pesquisar
      </Button>
      <Button onClick={handleClear} variant="outline">
        Limpar Pesquisa
      </Button>
    </form>
  )
}
