// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import { RelativePublishedAt } from '.'

const publishedAt = '2026-09-18T09:00:00.000Z'

afterEach(cleanup)

describe('RelativePublishedAt', () => {
  it('puts the absolute date in the server HTML, so hydration adds no line', () => {
    const html = renderToStaticMarkup(<RelativePublishedAt publishedAt={publishedAt} />)

    expect(html).toContain('18/09/2026, 06h00')
    expect(html).not.toContain('Há ')
  })

  it('appends the relative part once mounted', () => {
    render(<RelativePublishedAt publishedAt={publishedAt} />)

    expect(screen.getByText(/^18\/09\/2026, 06h00 - Há /)).toBeTruthy()
  })
})
