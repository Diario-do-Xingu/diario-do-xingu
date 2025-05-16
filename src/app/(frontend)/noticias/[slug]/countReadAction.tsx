'use server'

import { env } from '@/env'
import { getPayload } from '@/lib/payload/getPayload'

type Args = {
  articleId: string
}

export async function countReadAction({ articleId }: Args) {
  // const userCookies = await cookies()
  const payload = await getPayload()

  if (!env.NEXT_PUBLIC_IS_LIVE) {
    payload.logger.info(`Skip increase article read view for dev`)
    return
  }

  const article = await payload.findByID({
    collection: 'news',
    id: articleId,
  })

  // const { data, error } = await tryCatch<string[]>(
  //   (async () => JSON.parse(userCookies.get('readArticles')?.value || '[]') as string[])(),
  // )
  // async ()=> JSON.parse(userCookies.get('readArticles')?.value || '[]') ?? [],

  // const readArticles = data ?? []

  // if (error) {
  //   payload.logger.info(`Delete cookie due error`)
  //   userCookies.delete('readArticles')
  // }

  // if (readArticles.includes(articleId)) {
  //   payload.logger.info(`User has already read this article ${articleId}`)
  //   return // Do not send the request
  // }

  await payload.update({
    collection: 'news',
    id: articleId,
    data: {
      readCount: (article.readCount || 0) + 1,
    },
    context: {
      disableRevalidate: true,
    },
  })

  // userCookies.set('readArticles', JSON.stringify([...readArticles, articleId]))
  payload.logger.info(`Increase read counter for ${articleId}`)
}
