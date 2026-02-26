import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { PublicationsContent, type PublicationItem } from './PublicationsContent'
import type { Category } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const publications = await payload.find({
    collection: 'publications',
    depth: 1,
    limit: 300,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      publishedAt: true,
      populatedAuthors: true,
      meta: true,
    },
  })

  const items: PublicationItem[] = publications.docs.map((pub) => ({
    id: String(pub.id),
    title: pub.title,
    slug: pub.slug ?? null,
    categories: (pub.categories ?? [])
      .filter((c): c is Category => typeof c === 'object' && c !== null)
      .map((c) => ({ id: String(c.id), title: c.title ?? null })),
    publishedAt: pub.publishedAt ?? null,
    populatedAuthors: (pub.populatedAuthors ?? []).map((a) => ({
      id: a.id ?? '',
      name: a.name ?? null,
    })),
    meta: pub.meta ? { description: pub.meta.description ?? null } : null,
  }))

  return (
    <>
      <PageClient />
      <PublicationsContent publications={items} />
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Publications',
  }
}