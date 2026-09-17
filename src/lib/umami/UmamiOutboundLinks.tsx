'use client'

import { useEffect } from 'react'

const EVENT_NAME = 'Click link externo'

/**
 * Tags outbound links with the `data-umami-event` attributes the tracker reads, at click time.
 *
 * The tracker delegates from `document` in the capture phase and looks the attribute up with
 * `closest()`, so it only has to be set by the time the click reaches `document`. Listening on
 * `window` — one step earlier in the capture path — covers every link no matter when it was
 * rendered, which tagging the DOM once on load did not: anchors that appeared after a
 * client-side navigation were never tracked.
 *
 * Tagging rather than calling `umami.track()` here is deliberate: the tracker cancels the
 * navigation, sends the event and only then follows the link, so the request is not lost.
 */
export function UmamiOutboundLinks() {
  useEffect(() => {
    const tagOutboundLink = ({ target }: MouseEvent) => {
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      // An explicit event (share buttons, the header's social links) always wins.
      if (!anchor?.href || anchor.hasAttribute('data-umami-event')) return
      if (anchor.host === window.location.host) return

      anchor.setAttribute('data-umami-event', EVENT_NAME)
      anchor.setAttribute('data-umami-event-url', anchor.href)
    }

    window.addEventListener('click', tagOutboundLink, true)
    return () => window.removeEventListener('click', tagOutboundLink, true)
  }, [])

  return null
}
