import Script from 'next/script'
import { env } from '@/env'
import { UmamiOutboundLinks } from './UmamiOutboundLinks'

type UmamiProps = {
  /** The unique Umami website ID. */
  umamiWebsiteId: string
  /** Enable or disable automatic pageview tracking. Defaults to true. */
  umamiAutoTrack?: boolean
  /** Exclude URL query parameters from tracking. Defaults to false. */
  umamiExcludeSearch?: boolean
  /** Also report clicks on links that leave the site; see UmamiOutboundLinks. */
  trackOutboundLinks?: boolean
}

/**
 * Loads the Umami tracker. Its options are read from `data-*` attributes on the script tag, and
 * every one of them is a string, including the booleans.
 */
export function Umami({
  umamiWebsiteId,
  umamiAutoTrack,
  umamiExcludeSearch,
  trackOutboundLinks,
}: UmamiProps) {
  return (
    <>
      <Script
        async
        defer
        src={`${env.UMAMI_URI}/script.js`}
        data-website-id={umamiWebsiteId}
        data-auto-track={String(umamiAutoTrack ?? true)}
        data-exclude-search={String(umamiExcludeSearch ?? false)}
      />
      {trackOutboundLinks && <UmamiOutboundLinks />}
    </>
  )
}
