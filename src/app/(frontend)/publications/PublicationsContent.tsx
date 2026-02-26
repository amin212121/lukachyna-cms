'use client'

import Link from 'next/link'
import React, { useState } from 'react'

type PubCategory = { id: string; title: string | null }

export type PublicationItem = {
  id: string
  title: string
  slug: string | null
  categories: PubCategory[]
  publishedAt: string | null
  populatedAuthors: { id: string; name: string | null }[] | null
  meta?: { description?: string | null } | null
}

function getBadgeClass(categoryTitle: string | null) {
  const t = (categoryTitle ?? '').toLowerCase()
  if (t.includes('journal')) return 'type-badge type-badge--journal'
  if (t.includes('conference')) return 'type-badge type-badge--conference'
  return 'type-badge type-badge--default'
}

function formatIndex(i: number) {
  return String(i + 1).padStart(2, '0')
}

function getYear(dateStr: string | null) {
  if (!dateStr) return null
  return new Date(dateStr).getFullYear()
}

export function PublicationsContent({ publications }: { publications: PublicationItem[] }) {
  const allCategories = Array.from(
    new Set(publications.flatMap((p) => p.categories.map((c) => c.title ?? '')).filter(Boolean)),
  )
  const filters = ['All', ...allCategories]

  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? publications
      : publications.filter((p) => p.categories.some((c) => c.title === activeFilter))

  const total = publications.length
  const journalCount = publications.filter((p) =>
    p.categories.some((c) => (c.title ?? '').toLowerCase().includes('journal')),
  ).length
  const conferenceCount = publications.filter((p) =>
    p.categories.some((c) => (c.title ?? '').toLowerCase().includes('conference')),
  ).length

  const firstCategory = (pub: PublicationItem) => pub.categories[0]?.title ?? null

  return (
    <>
      {/* ─── PAGE HEADER ─── */}
      <section
        style={{ position: 'relative', padding: '5rem 0 6rem', overflow: 'hidden', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="page-grid-overlay" aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-eyebrow">
            <span className="section-num">04</span>
            <span className="section-eyebrow-sep" aria-hidden="true">·</span>
            <span className="section-label">Academic Work</span>
          </div>

          <h1 className="page-title">
            <span className="title-line title-line--solid">PUBLICATIONS /</span>
            <span className="title-line title-line--outline">RESEARCH</span>
          </h1>

          <div className="pub-stats">
            <div className="stat">
              <span className="stat__num">{total}</span>
              <span className="stat__label">Publications</span>
            </div>
            {journalCount > 0 && (
              <>
                <span className="stat-sep" aria-hidden="true">·</span>
                <div className="stat">
                  <span className="stat__num">{journalCount}</span>
                  <span className="stat__label">Journals</span>
                </div>
              </>
            )}
            {conferenceCount > 0 && (
              <>
                <span className="stat-sep" aria-hidden="true">·</span>
                <div className="stat">
                  <span className="stat__num">{conferenceCount}</span>
                  <span className="stat__label">Conferences</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── FILTER BAR ─── */}
      <div className="filter-bar">
        <div className="container filter-bar__inner">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-chip${activeFilter === f ? ' filter-chip--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ─── PUBLICATIONS LIST ─── */}
      <div className="container" style={{ padding: '4rem 0 8rem' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__dash" aria-hidden="true">—</span>
            <p className="empty-state__text">No publications found.</p>
          </div>
        ) : (
          <div
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            {filtered.map((pub, i) => {
              const catTitle = firstCategory(pub)
              const year = getYear(pub.publishedAt)
              const authors = pub.populatedAuthors?.map((a) => a.name).filter(Boolean).join(', ')

              return (
                <article
                  key={pub.id}
                  style={{
                    display: 'flex',
                    gap: 0,
                    borderBottom:
                      i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background 0.3s',
                  }}
                  className="pub-entry-row"
                >
                  {/* Left: index + year */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: '9rem',
                      padding: '2.5rem 2rem 2.5rem 2.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      borderRight: '1px solid var(--color-border)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.14em',
                        color: 'rgba(255,255,255,0.18)',
                        lineHeight: 1,
                      }}
                    >
                      {formatIndex(i)}
                    </span>
                    {year && (
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '2rem',
                          fontWeight: 800,
                          color: 'var(--color-muted)',
                          lineHeight: 1,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {year}
                      </span>
                    )}
                  </div>

                  {/* Right: content */}
                  <div style={{ flex: 1, minWidth: 0, padding: '2.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <span className={getBadgeClass(catTitle)}>{catTitle ?? 'Publication'}</span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
                        fontWeight: 600,
                        color: 'var(--text)',
                        lineHeight: 1.42,
                        marginBottom: '0.6rem',
                        maxWidth: 760,
                      }}
                    >
                      {pub.title}
                    </h2>

                    {authors && (
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          letterSpacing: '0.1em',
                          color: 'var(--color-muted)',
                          marginBottom: '1.25rem',
                        }}
                      >
                        {authors}
                      </p>
                    )}

                    {pub.meta?.description && (
                      <p
                        style={{
                          fontSize: '0.85rem',
                          lineHeight: 1.82,
                          color: 'rgba(228,232,240,0.5)',
                          maxWidth: 720,
                          marginBottom: '1.75rem',
                        }}
                      >
                        {pub.meta.description}
                      </p>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid var(--color-border)',
                      }}
                    >
                      <Link href={`/publications/${pub.slug}`} className="read-link read-link--muted">
                        Details <span className="read-arrow" aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .pub-entry-row:hover {
          background: var(--surface);
        }
      `}</style>
    </>
  )
}