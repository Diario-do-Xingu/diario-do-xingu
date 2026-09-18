// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { ArticleMedia } from '@/payload-types'
import { ImageMedia } from '.'

afterEach(cleanup)

const upload: ArticleMedia = {
  id: '68279ca34582388ce83c8b02',
  url: '/api/article-media/file/foto.webp',
  width: 1280,
  height: 720,
  createdAt: '2026-09-18T00:00:00.000Z',
  updatedAt: '2026-09-18T00:00:00.000Z',
}

const altOf = (ui: React.ReactElement) =>
  render(ui).container.querySelector('img')?.getAttribute('alt')

/**
 * The page usually knows the better description - an article's image caption, an edition's name -
 * and the upload's own `alt` is what is left when it does not.
 */
describe('ImageMedia alt text', () => {
  it('prefers what the page passes', () => {
    expect(
      altOf(<ImageMedia alt="Aeronave apreendida" resource={{ ...upload, alt: 'Uma foto' }} />),
    ).toBe('Aeronave apreendida')
  })

  it('falls back to the alt stored on the upload', () => {
    expect(altOf(<ImageMedia resource={{ ...upload, alt: 'Uma foto' }} />)).toBe('Uma foto')
  })

  it('falls back again when the page passes an empty string', () => {
    expect(altOf(<ImageMedia alt="" resource={{ ...upload, alt: 'Uma foto' }} />)).toBe('Uma foto')
  })

  it('is empty rather than absent when neither has one', () => {
    expect(altOf(<ImageMedia resource={upload} />)).toBe('')
  })
})
