// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { UmamiOutboundLinks } from './UmamiOutboundLinks'

/**
 * Stands in for Umami's tracker, which delegates from `document` in the capture phase and
 * reads the attributes off the closest matching ancestor. Returns what it would have sent.
 */
const trackerListening = () => {
  const tracked = vi.fn()
  const onClick = ({ target }: MouseEvent) => {
    const el = (target as Element).closest('[data-umami-event]')
    if (el) tracked(el.getAttribute('data-umami-event'), el.getAttribute('data-umami-event-url'))
  }
  document.addEventListener('click', onClick, true)
  return { tracked, stop: () => document.removeEventListener('click', onClick, true) }
}

/** Renders an anchor *after* mount, the way a client-side navigation would. */
const anchorRenderedLater = (html: string) => {
  document.body.insertAdjacentHTML('beforeend', html)
  return document.body.lastElementChild as HTMLAnchorElement
}

beforeAll(() => {
  // Every click here targets a real href, which jsdom answers with a "Not implemented:
  // navigation" warning. The real tracker cancels the navigation itself before sending.
  document.addEventListener('click', (event) => event.preventDefault())
})

afterEach(() => {
  // Vitest runs without globals, so Testing Library's automatic cleanup never registers and
  // a mounted component would keep its window listener for the rest of the file.
  cleanup()
  document.body.innerHTML = ''
})

describe('UmamiOutboundLinks', () => {
  it('tracks a link that was rendered after the page loaded', () => {
    render(<UmamiOutboundLinks />)
    const tracker = trackerListening()

    anchorRenderedLater('<a href="https://g1.globo.com/noticia">Fonte</a>').click()

    expect(tracker.tracked).toHaveBeenCalledWith(
      'Click link externo',
      'https://g1.globo.com/noticia',
    )
    tracker.stop()
  })

  it('tracks a click that starts on an element inside the link', () => {
    render(<UmamiOutboundLinks />)
    const tracker = trackerListening()

    const anchor = anchorRenderedLater('<a href="https://g1.globo.com"><span>Fonte</span></a>')
    anchor.querySelector('span')?.click()

    expect(tracker.tracked).toHaveBeenCalledOnce()
    tracker.stop()
  })

  it('leaves internal links and anchors without an href alone', () => {
    render(<UmamiOutboundLinks />)

    const internal = anchorRenderedLater('<a href="/noticias">Notícias</a>')
    const placeholder = anchorRenderedLater('<a>Sem link</a>')
    internal.click()
    placeholder.click()

    expect(internal.hasAttribute('data-umami-event')).toBe(false)
    expect(placeholder.hasAttribute('data-umami-event')).toBe(false)
  })

  it('does not overwrite an event the markup already declares', () => {
    render(<UmamiOutboundLinks />)

    const anchor = anchorRenderedLater(
      '<a href="https://wa.me/123" data-umami-event="Compartilhar artigo no whatsapp">Zap</a>',
    )
    anchor.click()

    expect(anchor.getAttribute('data-umami-event')).toBe('Compartilhar artigo no whatsapp')
    expect(anchor.hasAttribute('data-umami-event-url')).toBe(false)
  })

  it('stops tagging once unmounted', () => {
    const { unmount } = render(<UmamiOutboundLinks />)
    unmount()

    const anchor = anchorRenderedLater('<a href="https://g1.globo.com">Fonte</a>')
    anchor.click()

    expect(anchor.hasAttribute('data-umami-event')).toBe(false)
  })
})
