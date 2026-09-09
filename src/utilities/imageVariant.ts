/** The generated size to serve: `card` (640px wide) for thumbnails, `hero` (1280px) for large images. */
export type ImageVariant = 'card' | 'hero'

type GeneratedSize = { url?: string | null; width?: number | null; height?: number | null }

// Any Payload upload document: collections differ in which sizes they generate.
type SizedImage = {
  url?: string | null
  width?: number | null
  height?: number | null
  sizes?: { [name: string]: GeneratedSize | undefined } | null
}

/**
 * Picks the generated variant of an upload, falling back to the original for documents
 * uploaded before the variants existed (their `sizes` entries are empty) and for
 * collections that do not generate them.
 */
export function imageVariant(image: SizedImage, variant: ImageVariant) {
  const generated = image.sizes?.[variant]
  if (generated?.url && generated.width && generated.height) {
    return { src: generated.url, width: generated.width, height: generated.height }
  }
  return {
    src: image.url ?? '',
    width: image.width ?? undefined,
    height: image.height ?? undefined,
  }
}
