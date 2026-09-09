import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { COLLECTION_URL_PATHS, SITEMAP_TAGS } from '@/constants'
import { revalidatePathSafely, revalidateTagSafely } from '@/payload/hooks/revalidate'
import type { NotarialAct } from '@/payload-types'

// Notices are addressed by `key`; the create hook keeps `slug` equal to it.
const pathFor = (slug: NotarialAct['slug']) => `/${COLLECTION_URL_PATHS.NotarialActs}/${slug}`

export const revalidateNotarialActs: CollectionAfterChangeHook<NotarialAct> = async ({
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
  revalidateTagSafely(payload, SITEMAP_TAGS.NotarialActs)

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<NotarialAct> = async ({
  doc,
  req: { context, payload },
}) => {
  if (context.disableRevalidate) return doc

  for (const path of [...listPaths(), pathFor(doc?.slug)]) revalidatePathSafely(payload, path)
  revalidateTagSafely(payload, SITEMAP_TAGS.NotarialActs)

  return doc
}

const listPaths = () => {
  const rootPath = `/${COLLECTION_URL_PATHS.NotarialActs}`
  return ['/', rootPath, `${rootPath}/page/1`]
}
