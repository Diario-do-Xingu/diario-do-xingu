import { describe, expect, it } from 'vitest'
import { capitalizeWords, excerpt, joinWithAnd } from './formatString'

describe('joinWithAnd', () => {
  it('handles every list length', () => {
    expect(joinWithAnd([])).toBe('')
    expect(joinWithAnd(['Cartório'])).toBe('Cartório')
    expect(joinWithAnd(['Cartório', 'Prefeitura'])).toBe('Cartório e Prefeitura')
    expect(joinWithAnd(['Cartório', 'Prefeitura', 'Câmara'])).toBe('Cartório, Prefeitura e Câmara')
    expect(joinWithAnd(['a', 'b', 'c', 'd'])).toBe('a, b, c e d')
  })
})

describe('capitalizeWords', () => {
  it('uppercases the first letter of every whitespace-separated word', () => {
    expect(capitalizeWords('são félix do xingu')).toBe('São Félix Do Xingu')
  })

  it('leaves the rest of each word as it is, including hyphenated parts', () => {
    expect(capitalizeWords('quinta-feira, 15 de janeiro')).toBe('Quinta-feira, 15 De Janeiro')
    expect(capitalizeWords('MAIÚSCULAS já capitalizadas')).toBe('MAIÚSCULAS Já Capitalizadas')
  })
})

describe('excerpt', () => {
  it('collapses whitespace', () => {
    expect(excerpt('  texto   com \n quebras  ')).toBe('texto com quebras')
  })

  it('leaves text at or under the limit untouched', () => {
    expect(excerpt('a'.repeat(160))).toBe('a'.repeat(160))
  })

  it('cuts to the limit with an ellipsis', () => {
    const result = excerpt('a'.repeat(161))
    expect(result).toBe(`${'a'.repeat(159)}…`)
    expect(result).toHaveLength(160)
  })

  it('does not leave a space before the ellipsis when the cut lands on one', () => {
    expect(excerpt('abc def ghi', 9)).toBe('abc def…')
  })

  it('respects a custom limit', () => {
    expect(excerpt('abcdefghij', 5)).toBe('abcd…')
  })
})
