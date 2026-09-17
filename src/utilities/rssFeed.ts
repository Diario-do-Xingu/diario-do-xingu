/** One article in the feed. `link` and `publishedAt` are already absolute/ISO. */
export type FeedItem = {
  title: string
  link: string
  description?: string
  publishedAt?: string | null
}

type FeedChannel = {
  title: string
  description: string
  siteUrl: string
  feedUrl: string
  items: FeedItem[]
}

/**
 * Renders an RSS 2.0 document. Everything user-supplied goes through `escapeXml`, so an
 * ampersand or a quote in a headline cannot break the document.
 */
export function buildRssFeed({ title, description, siteUrl, feedUrl, items }: FeedChannel) {
  const lastBuildDate = rfc822(items[0]?.publishedAt) ?? new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>pt-BR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items.map(item).join('\n')}
  </channel>
</rss>
`
}

const item = ({ title, link, description, publishedAt }: FeedItem) => {
  const date = rfc822(publishedAt)

  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>${date ? `\n      <pubDate>${date}</pubDate>` : ''}${
        description ? `\n      <description>${escapeXml(description)}</description>` : ''
      }
    </item>`
}

/** RSS dates are RFC 822; anything unparseable is left out rather than emitted as "Invalid Date". */
const rfc822 = (value?: string | null) => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toUTCString()
}

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (char) => ESCAPES[char])
