import { describe, expect, it } from 'vitest'
import { buildRssFeed, type FeedItem } from './rssFeed'

const feed = (items: FeedItem[]) =>
  buildRssFeed({
    title: 'Diário do Xingu',
    description: 'Jornal Diário do Xingu',
    siteUrl: 'https://diariodoxingu.com',
    feedUrl: 'https://diariodoxingu.com/feed.xml',
    items,
  })

const article: FeedItem = {
  title: 'Chuva no Xingu',
  link: 'https://diariodoxingu.com/noticias/chuva-no-xingu',
  description: 'Chamada da matéria',
  publishedAt: '2026-01-15T15:04:00.000Z',
}

describe('buildRssFeed', () => {
  it('renders the channel and its self link', () => {
    const xml = feed([article])

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<title>Diário do Xingu</title>')
    expect(xml).toContain('<link>https://diariodoxingu.com</link>')
    expect(xml).toContain(
      '<atom:link href="https://diariodoxingu.com/feed.xml" rel="self" type="application/rss+xml" />',
    )
    expect(xml).toContain('<language>pt-BR</language>')
  })

  it('renders an item with an RFC 822 date and a permalink guid', () => {
    const xml = feed([article])

    expect(xml).toContain('<title>Chuva no Xingu</title>')
    expect(xml).toContain('<pubDate>Thu, 15 Jan 2026 15:04:00 GMT</pubDate>')
    expect(xml).toContain(
      '<guid isPermaLink="true">https://diariodoxingu.com/noticias/chuva-no-xingu</guid>',
    )
    expect(xml).toContain('<description>Chamada da matéria</description>')
  })

  it('escapes markup so a headline cannot break the document', () => {
    const xml = feed([
      { ...article, title: 'Prefeitura & "Câmara" <b>decidem</b>', description: "O'Brien disse" },
    ])

    expect(xml).toContain(
      '<title>Prefeitura &amp; &quot;Câmara&quot; &lt;b&gt;decidem&lt;/b&gt;</title>',
    )
    expect(xml).toContain('<description>O&apos;Brien disse</description>')
    expect(xml).not.toContain('<b>decidem</b>')
  })

  it('omits the date and description when an article has neither', () => {
    const xml = feed([{ title: 'Sem data', link: 'https://diariodoxingu.com/noticias/sem-data' }])

    expect(xml).not.toContain('<pubDate>')
    expect(xml).not.toContain('<description></description>')
  })

  it('leaves out an unparseable date rather than emitting "Invalid Date"', () => {
    const xml = feed([{ ...article, publishedAt: 'ontem' }])

    expect(xml).not.toContain('Invalid Date')
    expect(xml).not.toContain('<pubDate>')
  })

  it('dates the channel from the newest article', () => {
    const xml = feed([article, { ...article, publishedAt: '2020-01-01T00:00:00.000Z' }])

    expect(xml).toContain('<lastBuildDate>Thu, 15 Jan 2026 15:04:00 GMT</lastBuildDate>')
  })

  it('renders a valid empty feed', () => {
    const xml = feed([])

    expect(xml).toContain('<channel>')
    expect(xml).not.toContain('<item>')
    // no stray blank line where the items would have been
    expect(xml).toContain('type="application/rss+xml" />\n  </channel>')
  })
})
