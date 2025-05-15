import { TaskConfig, TaskHandlerResult } from 'payload'

const schedulePublishActionsResult = {
  publish: 'published',
  unpublish: 'draft',
} as const

export const schedulePublish = {
  retries: 5,
  slug: 'schedulePublish',

  handler: async ({ input, req: { payload } }): Promise<TaskHandlerResult<'schedulePublish'>> => {
    const collectionName = input.doc!.relationTo
    const docId = input.doc!.value.toString()

    payload.logger.info(`[Schedule Publish Handler] - Publishing item: ${collectionName}: ${docId}`)

    const item = await payload.findByID({
      collection: collectionName,
      id: docId,
    })

    if (!item) {
      payload.logger.error('[Schedule Publish Handler] - Item not found')

      return {
        state: 'failed',
        errorMessage: '[Schedule Publish Handler] - Item not found',
      }
    }

    const actionType = input.type as 'publish' | 'unpublish'

    await payload.update({
      context: {
        disableRevalidate: true,
      },
      collection: collectionName,
      data: {
        _status: schedulePublishActionsResult[actionType],
      },
      id: docId,
    })

    payload.logger.info('[Schedule Publish Handler] - Item published')

    return {
      state: 'succeeded',
      output: {},
    }
  },
} as TaskConfig<'schedulePublish'>
