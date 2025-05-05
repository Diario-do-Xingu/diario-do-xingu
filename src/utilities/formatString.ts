export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase())
}

export function joinWithAnd(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return items.join(' e ')

  const allButLast = items.slice(0, -1).join(', ')
  const last = items[items.length - 1]
  return `${allButLast} e ${last}`
}
