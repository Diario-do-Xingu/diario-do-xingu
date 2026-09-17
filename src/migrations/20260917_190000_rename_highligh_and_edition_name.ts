import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

/**
 * Renames two fields that were awkward to use from the frontend:
 *
 *   news.highligh                      -> news.highlight              (typo)
 *   digital-editions.digital-edition-name -> digital-editions.name    (hyphen forced bracket access)
 *
 * News keeps drafts and up to ten revisions per document, and Payload restores from those, so
 * the copies inside `_news_versions.version` have to move with the field or every draft would
 * come back carrying the old name. Documents that never had the field are left alone: `$rename`
 * skips them rather than creating an empty one.
 */
const RENAMES = [
  { collection: 'news', from: 'highligh', to: 'highlight' },
  { collection: '_news_versions', from: 'version.highligh', to: 'version.highlight' },
  { collection: 'digital-editions', from: 'digital-edition-name', to: 'name' },
] as const

export async function up({ payload, session }: MigrateUpArgs): Promise<void> {
  for (const { collection, from, to } of RENAMES) {
    const { modifiedCount } = await payload.db.connection
      .collection(collection)
      .updateMany({ [from]: { $exists: true } }, { $rename: { [from]: to } }, { session })

    payload.logger.info(`${collection}: renamed ${from} -> ${to} on ${modifiedCount} documents`)
  }
}

export async function down({ payload, session }: MigrateDownArgs): Promise<void> {
  for (const { collection, from, to } of RENAMES) {
    const { modifiedCount } = await payload.db.connection
      .collection(collection)
      .updateMany({ [to]: { $exists: true } }, { $rename: { [to]: from } }, { session })

    payload.logger.info(`${collection}: reverted ${to} -> ${from} on ${modifiedCount} documents`)
  }
}
