import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Publication } from '../../../payload-types'

export const revalidatePublication: CollectionAfterChangeHook<Publication> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/publications/${doc.slug}`

      payload.logger.info(`Revalidating publication at path: ${path}`)

      revalidatePath(path)
      revalidateTag('publications-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/publications/${previousDoc.slug}`

      payload.logger.info(`Revalidating old publication at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('publications-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Publication> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/publications/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('publications-sitemap')
  }

  return doc
}