/* eslint-disable @typescript-eslint/no-explicit-any */
import Script from 'next/script'

/**
 * Props for the Umami component.
 */
export interface UmamiProps {
  trackOutboundLinks?: boolean
  /** The unique Umami website ID. */
  umamiWebsiteId: string
  /** The Umami host URL. */
  umamiHostUrl?: string
  /** Tag to identify the script. */
  umamiTag?: string
  /** Enable or disable automatic tracking. Defaults to true. */
  umamiAutoTrack?: boolean
  /** Exclude URL query parameters from tracking. Defaults to false. */
  umamiExcludeSearch?: boolean
  /** A comma-separated list of domains to limit tracking to. */
  umamiDomains?: string
  /** Source URL for the Umami script. Defaults to the official CDN. */
  src: string
  /** Additional data attributes for the script tag. */
  [key: `data${string}`]: any
}

const propToDataAttributeMap = {
  umamiWebsiteId: 'data-website-id',
  umamiHostUrl: 'data-host-url',
  umamiTag: 'data-tag',
  umamiAutoTrack: 'data-auto-track',
  umamiExcludeSearch: 'data-exclude-search',
  umamiDomains: 'data-domains',
} as const

type UmamiPropKeys = keyof typeof propToDataAttributeMap

/**
 * A React component that integrates Umami analytics via a script tag.
 *
 * @param props - The props for the Umami component.
 * @returns A Script element with the Umami analytics script and dynamic data attributes.
 */
export function Umami({ src, trackOutboundLinks, ...props }: UmamiProps) {
  const dataAttributes: Record<string, any> = {}

  // Map known Umami props to data attributes
  Object.entries(props).forEach(([propName, propValue]) => {
    if (!(propName in propToDataAttributeMap)) return

    // Umami props only accept string
    if (typeof propValue === 'boolean') {
      propValue = propValue === true ? 'true' : 'false'
    }

    dataAttributes[propToDataAttributeMap[propName as UmamiPropKeys]] = propValue
  })

  // Include additional data attributes passed via props
  Object.entries(props).forEach(([key, value]) => {
    if (!key.startsWith('data') || !value || key in propToDataAttributeMap) return
    const attributeName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    dataAttributes[attributeName] = value
  })

  return (
    <>
      <Script async defer src={src} {...dataAttributes} />

      {/* track outbound links */}
      {trackOutboundLinks && (
        <Script id="umami-outbound-tracking">
          {`
            (() => {
              const name = 'click-link-externo';
              document.querySelectorAll('a').forEach(a => {
                if (a.host !== window.location.host && !a.getAttribute('data-umami-event')) {
                  a.setAttribute('data-umami-event', name);
                  a.setAttribute('data-umami-event-url', a.href);
                }
              });
            })();
          `}
        </Script>
      )}
    </>
  )
}
