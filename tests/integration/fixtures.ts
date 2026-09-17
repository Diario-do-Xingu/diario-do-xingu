import { api } from './client'

type Doc = { id: string }
type Listed = { docs?: Doc[] }
type Created = { doc?: Doc }

/** A published category and an uploaded image, created once and reused by every article. */
export async function articleFixtures() {
  fixtures ??= create()
  return fixtures
}

let fixtures: Promise<{ categoryId: string; imageId: string }> | undefined

async function create() {
  const existingCategory = await api<Listed>('/news-categories?limit=1')
  const categoryId =
    existingCategory.json.docs?.[0]?.id ??
    (await api<Created>('/news-categories', { method: 'POST', body: { name: 'Integração' } })).json
      .doc?.id

  const existingImage = await api<Listed>('/article-media?limit=1')
  let imageId = existingImage.json.docs?.[0]?.id

  if (!imageId) {
    // A 1x1 png, enough for sharp to generate the collection's variants.
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    )
    const form = new FormData()
    form.append('file', new Blob([png], { type: 'image/png' }), 'capa.png')
    imageId = (await api<Created>('/article-media', { method: 'POST', body: form })).json.doc?.id
  }

  if (!categoryId || !imageId) throw new Error('Could not create the article fixtures')
  return { categoryId, imageId }
}

/** The minimum a News document needs to validate. */
export const newsBody = (
  { categoryId, imageId }: { categoryId: string; imageId: string },
  over: Record<string, unknown> = {},
) => ({
  heading: 'Matéria de integração',
  highlight: 'Chamada',
  category: categoryId,
  heroImage: { image: imageId, description: 'Capa' },
  content: {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              text: 'Corpo da matéria.',
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              version: 1,
            },
          ],
        },
      ],
    },
  },
  ...over,
})

/** A syntactically valid PDF; Payload rejects uploads whose bytes do not match the label. */
export const samplePdf = () =>
  Buffer.from(`%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF
`)
