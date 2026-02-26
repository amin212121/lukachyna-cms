import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { formatAuthors } from '@/utilities/formatAuthors'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function PostPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  const authorsStr =
    post.populatedAuthors && post.populatedAuthors.length > 0
      ? formatAuthors(post.populatedAuthors)
      : null

  return (
    <article style={{ paddingBottom: '8rem' }}>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Back navigation */}
      <nav className="back-nav">
        <div className="container">
          <Link href="/posts" className="back-link">
            <span className="back-arrow" aria-hidden="true">←</span>
            Blog
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <PostHero post={post} />

      {/* Article prose */}
      <div style={{ padding: '4.5rem 0 2rem' }}>
        <div className="container">
          <RichText
            className="max-w-[45rem]"
            data={post.content}
            enableGutter={false}
          />
        </div>
      </div>

      {/* Author bio */}
      {authorsStr && (
        <div
          style={{
            padding: '3.5rem 0',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'flex-start',
                maxWidth: 680,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 54,
                  height: 54,
                  flexShrink: 0,
                  borderRadius: 4,
                  background: 'var(--surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--color-accent)',
                  letterSpacing: '0.04em',
                }}
                aria-hidden="true"
              >
                {authorsStr
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {authorsStr}
                </div>
                <p
                  style={{
                    fontSize: '0.825rem',
                    lineHeight: 1.8,
                    color: 'var(--color-muted)',
                    marginBottom: '1rem',
                  }}
                >
                  Front-end engineer, educator, and researcher at twnty Digital.
                </p>
                <Link
                  href="/contact"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    transition: 'color 0.2s',
                  }}
                >
                  Get in touch →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div style={{ padding: '4.5rem 0 0' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '2.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                }}
              >
                More from Blog
              </h2>
              <Link
                href="/posts"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}
              >
                All Posts →
              </Link>
            </div>

            <RelatedPosts
              className="mt-0"
              docs={post.relatedPosts.filter((p): p is Post => typeof p === 'object')}
            />
          </div>
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })
  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})