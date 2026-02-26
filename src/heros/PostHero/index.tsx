import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'

function getCategoryClass(title: string | null) {
  const t = (title ?? '').toLowerCase()
  if (t.includes('tech')) return 'post-cat post-cat--tech'
  if (t.includes('career')) return 'post-cat post-cat--career'
  if (t.includes('edu')) return 'post-cat post-cat--education'
  if (t.includes('resource')) return 'post-cat post-cat--resources'
  return 'post-cat post-cat--default'
}

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title } = post

  const authorsStr =
    populatedAuthors && populatedAuthors.length > 0 ? formatAuthors(populatedAuthors) : null

  const firstCat =
    categories && categories.length > 0 && typeof categories[0] === 'object'
      ? (categories[0] as { id: number; title: string })
      : null

  return (
    <>
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
          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            {firstCat && (
              <span className={getCategoryClass(firstCat.title)}>{firstCat.title}</span>
            )}
            {publishedAt && (
              <>
                <span
                  style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.85rem' }}
                  aria-hidden="true"
                >
                  ·
                </span>
                <time
                  dateTime={publishedAt}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.63rem',
                    letterSpacing: '0.1em',
                    color: 'var(--color-muted)',
                  }}
                >
                  {formatDateTime(publishedAt)}
                </time>
              </>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 6vw, 7rem)',
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--text)',
              marginBottom: '2.75rem',
              maxWidth: 1000,
            }}
          >
            {title}
          </h1>

          {/* Footer: author + date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            {authorsStr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                  }}
                >
                  By
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    color: 'var(--text)',
                  }}
                >
                  {authorsStr}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <style>{`
        .post-cat {
          font-family: var(--font-mono), 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
          white-space: nowrap;
        }
        .post-cat--tech { color: var(--color-accent); background: rgba(79,172,254,0.1); }
        .post-cat--career { color: var(--color-ember); background: rgba(255,92,43,0.1); }
        .post-cat--education { color: #52d18a; background: rgba(82,209,138,0.1); }
        .post-cat--resources { color: #c084fc; background: rgba(192,132,252,0.1); }
        .post-cat--default { color: var(--color-muted); background: var(--surface); border: 1px solid var(--color-border); }
      `}</style>
    </>
  )
}