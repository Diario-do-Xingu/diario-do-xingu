import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Advertisement } from '@/components/Advertisement'
import { ArticleHighlightSection } from '@/components/ArticleHighlightSection'
import { ArticleMostReadSection } from '@/components/ArticleMostReadSection'
import { ArticleRelatedSection } from '@/components/ArticleRelatedSection'
import { ArticleHero } from '@/components/Articles/ArticleHero'
import { DigitalEditionsSection } from '@/components/DigitalEditions/DigitalEditionsSection'
import { Grid, GridLeft, GridRight } from '@/components/Grid'
import RichText from '@/components/RichText'
import { SoccerWidget } from '@/components/SoccerWidget'
import { WeatherWidget } from '@/components/WeatherWidget'
import { COLLECTION_SLUGS, COLLECTION_URL_PATHS } from '@/constants'
import { getPayload } from '@/lib/payload/getPayload'
import type { News } from '@/payload-types'
import { excerpt } from '@/utilities/formatString'
import { absoluteUrl, getSiteMeta } from '@/utilities/getSiteMeta'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { buildNewsArticleJsonLd, serializeJsonLd } from '@/utilities/newsArticleJsonLd'
import { CountRead } from './CountRead'

// Sidebars and ads are rendered from live queries at generation time; refresh them on the
// same 10-minute window the list routes use instead of only when this document is republished.
export const revalidate = 600

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// Shared by generateMetadata and the page so the article is queried once per request.
// Anonymous visitors only see published articles (overrideAccess: false).
const findArticle = cache(async (slug: string) => {
  const payload = await getPayload()

  const {
    docs: [article],
  } = await payload.find({
    collection: COLLECTION_SLUGS.News,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return article
})

// Shared between the metadata and the structured data so the two never drift apart.
const heroImageOf = (article: News) => {
  const hero = article.heroImage.image
  if (typeof hero !== 'object' || !hero.url) return undefined
  return { url: hero.url, width: hero.width ?? undefined, height: hero.height ?? undefined }
}
const describe = (article: News, fallback: string) =>
  excerpt(article.subheading || article.highligh || fallback)

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '' } = await params
  const article = await findArticle(slug)

  if (!article) return {}

  const { siteName, siteDescription, images: siteImages } = await getSiteMeta()
  const hero = heroImageOf(article)
  const images = hero ? [{ ...hero, alt: article.heroImage.description || undefined }] : siteImages

  const title = article.heading
  const description = describe(article, siteDescription)
  const url = `/${COLLECTION_URL_PATHS.News}/${article.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: mergeOpenGraph({
      type: 'article',
      siteName,
      title,
      description,
      url,
      images,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      authors: article.authors?.flatMap(({ name }) => (name ? [name] : [])),
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const article = await findArticle(slug)

  if (!article) notFound()

  const { siteName, siteDescription, logoUrl } = await getSiteMeta()
  const hero = heroImageOf(article)
  const jsonLd = buildNewsArticleJsonLd({
    article,
    url: `${getServerSideURL()}/${COLLECTION_URL_PATHS.News}/${article.slug}`,
    image: hero && { ...hero, url: absoluteUrl(hero.url) ?? hero.url },
    publisher: { name: siteName, logoUrl },
    description: describe(article, siteDescription),
  })

  return (
    <div>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output with every '<' escaped to \u003c cannot close the script element
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <CountRead articleId={article.id} />
      <Grid className="container-y-padding container">
        <GridLeft>
          <ArticleHero article={article} />

          <RichText className="mt-8" data={article.content} enableGutter={false} />

          <ArticleRelatedSection
            categoryId={
              typeof article.category === 'string' ? article.category : article.category.id
            }
            currentArticleSlug={article.slug!}
          />
        </GridLeft>

        <GridRight className="mt-10 space-y-5 lg:mt-0">
          <ArticleHighlightSection />
          <WeatherWidget />
          <ArticleMostReadSection />
          <DigitalEditionsSection />
          <Advertisement adType="firstSideAdsBanner" />
          <SoccerWidget />
          <Advertisement adType="secondSideAdsBanner" />
        </GridRight>
      </Grid>
    </div>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: COLLECTION_SLUGS.News,
    overrideAccess: false,
    draft: false,
    limit: 100,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = docs.map(({ slug }) => ({ slug }))

  return params
}
