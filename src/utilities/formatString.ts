export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase())
}
