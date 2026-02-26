import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'

import type { Publication } from '@/payload-types'

import { PublicationHero } from '@/heros/PublicationHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const publications = await payload.find({
    collection: 'publications',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return publications.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function PublicationPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/publications/' + slug
  const publication = await queryPublicationBySlug({ slug })

  if (!publication) return <PayloadRedirects url={url} />

  const relatedPubs = (publication.relatedPublications ?? []).filter(
    (p): p is Publication => typeof p === 'object' && p !== null,
  )

  return (
    <article style={{ paddingBottom: '8rem' }}>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Back navigation */}
      <nav className="back-nav">
        <div className="container">
          <Link href="/publications" className="back-link">
            <span className="back-arrow" aria-hidden="true">←</span>
            Publications
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <PublicationHero publication={publication} />

      {/* Body: Abstract / Content */}
      <div className="container">
        {publication.meta?.description && (
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '3rem',
              padding: '3rem 0',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                paddingTop: '0.15rem',
              }}
            >
              Abstract
            </h2>
            <div style={{ maxWidth: 680 }}>
              <p
                style={{
                  fontSize: '0.975rem',
                  lineHeight: 1.92,
                  color: 'rgba(228,232,240,0.76)',
                }}
              >
                {publication.meta.description}
              </p>
            </div>
          </section>
        )}

        {/* Rich content */}
        <div style={{ padding: '3rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <RichText className="max-w-[48rem]" data={publication.content} enableGutter={false} />
        </div>
      </div>

      {/* Related Publications */}
      {relatedPubs.length > 0 && (
        <div style={{ padding: '4.5rem 0 0' }}>
          <div className="container">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.6rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Related Publications
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {relatedPubs.map((pub) => (
                <Link
                  key={pub.id}
                  href={`/publications/${pub.slug}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    gap: '2rem',
                    alignItems: 'center',
                    padding: '1.75rem 0',
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'background 0.25s',
                  }}
                  className="related-pub-link"
                >
                  <div>
                    {pub.publishedAt && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          letterSpacing: '0.08em',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {new Date(pub.publishedAt).getFullYear()}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        lineHeight: 1.48,
                      }}
                    >
                      {pub.title}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      color: 'var(--color-muted)',
                      transition: 'transform 0.22s, color 0.22s',
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <style>{`
            .related-pub-link:hover { background: rgba(255,255,255,0.015); }
          `}</style>
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const publication = await queryPublicationBySlug({ slug })
  return generateMeta({ doc: publication })
}

const queryPublicationBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'publications',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})