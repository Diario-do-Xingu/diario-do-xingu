import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, TypeWithID } from 'payload'
import { revalidatePathSafely, revalidateTagSafely } from '@/payload/hooks/revalidate'

type Publishable = TypeWithID & {
  slug?: string | null
  _status?: ('draft' | 'published') | null
}

/**
 * Builds the `afterChange`/`afterDelete` pair that keeps a collection's public pages fresh:
 * its list routes, the document's own URL, and the sitemap tag.
 *
 * News and notarial acts are addressed the same way (`/<urlPath>/<slug>`) and differ only in
 * where they live, so they share this instead of one copy each.
 */
export const createRevalidateHooks = <T extends Publishable>({
  urlPath,
  sitemapTag,
}: {
  urlPath: string
  sitemapTag: string
}) => {
  const pathFor = (slug: T['slug']) => `/${urlPath}/${slug}`
  // `/page/1` redirects to the list root (next.config.mjs), so the root covers page 1.
  const listPaths = () => ['/', `/${urlPath}`]

  const afterChange: CollectionAfterChangeHook<T> = async ({
    doc,
    previousDoc,
    req: { payload, context },
  }) => {
    if (context.disableRevalidate) return doc

    const wasPublished = previousDoc?._status === 'published'
    const isPublished = doc._status === 'published'
    if (!wasPublished && !isPublished) return doc

    const paths = new Set(listPaths())
    if (isPublished) paths.add(pathFor(doc.slug))
    // Unpublished, or published under a new slug: the old URL must stop serving the cached page.
    if (wasPublished && (!isPublished || previousDoc.slug !== doc.slug)) {
      paths.add(pathFor(previousDoc.slug))
    }

    for (const path of paths) revalidatePathSafely(payload, path)
    revalidateTagSafely(payload, sitemapTag)

    return doc
  }

  const afterDelete: CollectionAfterDeleteHook<T> = async ({ doc, req: { context, payload } }) => {
    if (context.disableRevalidate) return doc

    for (const path of [...listPaths(), pathFor(doc?.slug)]) revalidatePathSafely(payload, path)
    revalidateTagSafely(payload, sitemapTag)

    return doc
  }

  return { afterChange, afterDelete }
}
