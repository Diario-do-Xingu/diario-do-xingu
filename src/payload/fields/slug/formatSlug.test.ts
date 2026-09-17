import type { FieldHook } from 'payload'
import { describe, expect, it } from 'vitest'
import { formatSlug, formatSlugHook } from './formatSlug'

// The hook only ever reads these three args; the rest of Payload's FieldHook context is irrelevant.
type HookArgs = Pick<Parameters<FieldHook>[0], 'data' | 'operation' | 'value'>
const runHook = (fallback: string, args: HookArgs) =>
  formatSlugHook(fallback)(args as Parameters<FieldHook>[0])

describe('formatSlug', () => {
  it('strips accents from Portuguese titles', () => {
    expect(formatSlug('Ação Notarial em São Félix')).toBe('acao-notarial-em-sao-felix')
    expect(formatSlug('Óbito, Inventário e Partilha')).toBe('obito-inventario-e-partilha')
  })

  it('collapses whitespace and drops surrounding space instead of leaving stray hyphens', () => {
    expect(formatSlug('  Edital   de   Praça  ')).toBe('edital-de-praca')
    expect(formatSlug('quebra\nde\tlinha')).toBe('quebra-de-linha')
  })

  it('removes symbols and lowercases', () => {
    expect(formatSlug('Prefeitura & Câmara: R$ 1.000,00!')).toBe('prefeitura--camara-r-100000')
    expect(formatSlug('Já-Existe-Um-Slug')).toBe('ja-existe-um-slug')
  })

  it('keeps digits and underscores', () => {
    expect(formatSlug('Lei 14_133 de 2021')).toBe('lei-14_133-de-2021')
  })

  it('returns an empty string when nothing survives', () => {
    expect(formatSlug('!!!')).toBe('')
  })
})

describe('formatSlugHook', () => {
  it('formats a slug typed by hand', () => {
    expect(runHook('title', { operation: 'create', value: 'Notícia Nova' })).toBe('noticia-nova')
  })

  it('falls back to the source field on create', () => {
    expect(runHook('title', { data: { title: 'Notícia Nova' }, operation: 'create' })).toBe(
      'noticia-nova',
    )
  })

  it('fills an empty slug on update', () => {
    expect(runHook('title', { data: { title: 'Notícia Nova' }, operation: 'update' })).toBe(
      'noticia-nova',
    )
  })

  it('leaves an existing slug alone on update', () => {
    const args = {
      data: { slug: 'slug-antigo', title: 'Título Novo' },
      operation: 'update',
    } as const
    expect(runHook('title', args)).toBeUndefined()
  })

  it('returns the value untouched when there is nothing to derive a slug from', () => {
    expect(runHook('title', { data: {}, operation: 'create', value: null })).toBeNull()
    expect(runHook('title', { data: { title: 42 }, operation: 'create' })).toBeUndefined()
  })
})
