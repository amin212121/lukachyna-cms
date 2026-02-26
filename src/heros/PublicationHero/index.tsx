import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Publication } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'

function getBadgeClass(title: string | null) {
  const t = (title ?? '').toLowerCase()
  if (t.includes('journal')) return 'type-badge type-badge--journal'
  if (t.includes('conference')) return 'type-badge type-badge--conference'
  return 'type-badge type-badge--default'
}

export const PublicationHero: React.FC<{ publication: Publication }> = ({ publication }) => {
  const { categories, populatedAuthors, publishedAt, title } = publication

  const authorsStr =
    populatedAuthors && populatedAuthors.length > 0 ? formatAuthors(populatedAuthors) : null

  const firstCat =
    categories && categories.length > 0 && typeof categories[0] === 'object'
      ? (categories[0] as { id: number; title: string })
      : null

  const year = publishedAt ? new Date(publishedAt).getFullYear() : null

  return (
    <header
      style={{
        position: 'relative',
        padding: '4rem 0 5.5rem',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="page-grid-overlay" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          {year && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                color: 'var(--color-accent)',
              }}
            >
              {year}
            </span>
          )}
          {year && firstCat && (
            <span
              style={{
                color: 'rgba(255,255,255,0.15)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
              }}
              aria-hidden="true"
            >
              ·
            </span>
          )}
          {firstCat && (
            <span className={getBadgeClass(firstCat.title)}>{firstCat.title}</span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5.5vw, 7rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            marginBottom: '3.5rem',
            maxWidth: 1000,
          }}
        >
          {title}
        </h1>

        {/* Meta footer */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          {authorsStr && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.56rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                }}
              >
                Authors
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                }}
              >
                {authorsStr}
              </span>
            </div>
          )}
          {publishedAt && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.56rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                }}
              >
                Published
              </span>
              <time
                dateTime={publishedAt}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                }}
              >
                {formatDateTime(publishedAt)}
              </time>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}