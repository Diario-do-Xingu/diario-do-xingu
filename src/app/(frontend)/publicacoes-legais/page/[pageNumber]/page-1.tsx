// import { getPayload } from 'payload'
// import configPromise from '@payload-config'
// import { Metadata } from 'next'
// import { COLLECTION_SLUGS, ARCHIVE_LIMIT } from '@/constants'
// import { notFound } from 'next/navigation'
// import { PageComponent } from '../../PageComponent'
// import { generateNotarialActMeta } from '@/utilities/generateNotarialActMeta'

// type Args = {
//   params: Promise<{
//     pageNumber: string
//   }>
// }

// export default async function Page({ params: paramsPromise }: Args) {
//   const payload = await getPayload({ config: configPromise })
//   const { pageNumber } = await paramsPromise

//   const sanitizedPageNumber = Number(pageNumber)

//   if (!Number.isInteger(sanitizedPageNumber)) notFound()

//   const notarialActs = await payload.find({
//     collection: COLLECTION_SLUGS.NotarialActs,
//     limit: ARCHIVE_LIMIT.NotarialActs,
//     page: sanitizedPageNumber,
//     overrideAccess: false,
//     sort: '-publishedAt',
//   })

//   return <PageComponent notarialActs={notarialActs} />
// }

// export async function generateMetadata(): Promise<Metadata> {
//   return await generateNotarialActMeta()
// }
