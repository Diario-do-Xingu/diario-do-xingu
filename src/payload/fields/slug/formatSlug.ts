import type { FieldHook } from 'payload'

// export const formatSlug = (val: string): string =>
//   val
//     .replace(/ /g, '-')
//     .replace(/[^\w-]+/g, '')
//     .toLowerCase()

export const formatSlug = (val: string): string =>
  val
    .normalize('NFD') // 1. Decompose accented letters
    .replace(/[\u0300-\u036f]/g, '') // 2. Remove diacritics
    .replace(/\s+/g, '-') // 3. Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // 4. Remove all non-word characters except hyphens
    .toLowerCase()

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string') {
      return formatSlug(value)
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }
    }

    return value
  }
