'use client'

import Link from 'next/link'
import React, { useState } from 'react'

export type PostItem = {
  id: string
  title: string
  slug: string
  categories: { id: string; title: string | null }[]
  publishedAt: string | null
  populatedAuthors: { id: string; name: string | null }[] | null
  meta: { description?: string | null } | null
}

function getCategoryClass(title: string | null) {
  const t = (title ?? '').toLowerCase()
  if (t.includes('tech')) return 'post-cat post-cat--tech'
  if (t.includes('career')) return 'post-cat post-cat--career'
  if (t.includes('edu')) return 'post-cat post-cat--education'
  if (t.includes('resource')) return 'post-cat post-cat--resources'
  return 'post-cat post-cat--default'
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getCardNumber(i: number) {
  return String(i + 2).padStart(2, '0') // +2 because 01 is featured
}

export function PostsContent({ posts }: { posts: PostItem[] }) {
  const allCats = Array.from(
    new Set(posts.flatMap((p) => p.categories.map((c) => c.title ?? '')).filter(Boolean)),
  )
  const filters = ['All', ...allCats]

  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? posts
      : posts.filter((p) => p.categories.some((c) => c.title === activeFilter))

  const featuredPost = filtered[0] ?? null
  const gridPosts = filtered.slice(1)
  const showFeatured = featuredPost !== null

  return (
    <>
      {/* ─── PAGE HEADER ─── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 6rem',
          overflow: 'hidden',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="page-grid-overlay" aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-eyebrow">
            <span className="section-num">03</span>
            <span className="section-eyebrow-sep" aria-hidden="true">·</span>
            <span className="section-label">Articles &amp; Writing</span>
          </div>

          <h1 className="page-title">
            <span className="title-line title-line--solid">THOUGHTS /</span>
            <span className="title-line title-line--outline">WRITINGS</span>
          </h1>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              border: '1px solid var(--color-border)',
              padding: '0.4rem 1rem',
              borderRadius: 2,
              background: 'var(--surface)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--color-accent)',
                lineHeight: 1,
              }}
            >
              {posts.length}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}
            >
              Articles Published
            </span>
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

      {/* ─── FEATURED POST ─── */}
      {showFeatured && (
        <div
          style={{
            padding: '4rem 0',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            <article
              style={{
                position: 'relative',
                background: 'var(--surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 4,
                overflow: 'hidden',
                display: 'flex',
                transition: 'border-color 0.35s, box-shadow 0.35s',
              }}
              className="featured-post-card"
            >
              {/* Accent bar */}
              <div
                style={{
                  width: 3,
                  flexShrink: 0,
                  background: `linear-gradient(to bottom, var(--color-accent), rgba(79,172,254,0.15))`,
                }}
              />

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '3rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {featuredPost.categories[0] && (
                      <span className={getCategoryClass(featuredPost.categories[0].title)}>
                        {featuredPost.categories[0].title}
                      </span>
                    )}
                    {featuredPost.publishedAt && (
                      <>
                        <span style={{ color: 'var(--color-border)', fontSize: '0.85rem' }} aria-hidden="true">·</span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.63rem',
                            letterSpacing: '0.1em',
                            color: 'var(--color-muted)',
                          }}
                        >
                          {formatDate(featuredPost.publishedAt)}
                        </span>
                      </>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                      border: '1px solid rgba(79,172,254,0.3)',
                      padding: '0.2rem 0.65rem',
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Featured
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.9rem, 4vw, 3.5rem)',
                    fontWeight: 800,
                    lineHeight: 1.06,
                    letterSpacing: '-0.015em',
                    color: 'var(--text)',
                    marginBottom: '1.25rem',
                    maxWidth: 800,
                  }}
                >
                  {featuredPost.title}
                </h2>

                {featuredPost.meta?.description && (
                  <p
                    style={{
                      fontSize: '1rem',
                      lineHeight: 1.82,
                      color: 'var(--color-muted)',
                      maxWidth: 620,
                      marginBottom: '2.25rem',
                    }}
                  >
                    {featuredPost.meta.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Link href={`/posts/${featuredPost.slug}`} className="read-link">
                    Read Article <span className="read-arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              {/* Decorative number */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '2rem',
                  transform: 'translateY(-50%)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(7rem, 15vw, 17rem)',
                  fontWeight: 900,
                  color: 'var(--text)',
                  opacity: 0.028,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                01
              </div>
            </article>
          </div>
        </div>
      )}

      {/* ─── POSTS GRID ─── */}
      <div className="container" style={{ padding: '4rem 0 8rem' }}>
        {gridPosts.length === 0 && !showFeatured ? (
          <div className="empty-state">
            <span className="empty-state__dash" aria-hidden="true">—</span>
            <p className="empty-state__text">No posts found.</p>
          </div>
        ) : gridPosts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              background: 'var(--color-border)',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              overflow: 'hidden',
            }}
            className="posts-grid-responsive"
          >
            {gridPosts.map((post, i) => (
              <article
                key={post.id}
                style={{
                  position: 'relative',
                  background: 'var(--bg)',
                  padding: '2.5rem',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'background 0.3s',
                  cursor: 'pointer',
                }}
                className="post-grid-card"
              >
                {/* Decorative number */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1.5rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '5rem',
                    fontWeight: 900,
                    color: 'var(--text)',
                    opacity: 0.04,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    transition: 'opacity 0.3s, color 0.3s',
                  }}
                >
                  {getCardNumber(i)}
                </div>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {post.categories[0] && (
                      <span className={getCategoryClass(post.categories[0].title)}>
                        {post.categories[0].title}
                      </span>
                    )}
                    {post.publishedAt && (
                      <>
                        <span style={{ color: 'var(--color-border)', fontSize: '0.85rem' }} aria-hidden="true">·</span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.63rem',
                            letterSpacing: '0.1em',
                            color: 'var(--color-muted)',
                          }}
                        >
                          {formatDate(post.publishedAt)}
                        </span>
                      </>
                    )}
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--text)',
                      lineHeight: 1.42,
                      marginTop: '0.875rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {post.title}
                  </h3>

                  {post.meta?.description && (
                    <p
                      style={{
                        fontSize: '0.825rem',
                        lineHeight: 1.78,
                        color: 'var(--color-muted)',
                        flex: 1,
                        marginBottom: '1.5rem',
                      }}
                    >
                      {post.meta.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginTop: 'auto',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.63rem',
                        letterSpacing: '0.1em',
                        color: 'var(--color-muted)',
                      }}
                    >
                      {formatDate(post.publishedAt)}
                    </span>
                    <Link href={`/posts/${post.slug}`} className="read-link read-link--muted" style={{ fontSize: '0.6rem' }}>
                      Read <span className="read-arrow" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

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
        .featured-post-card:hover { border-color: rgba(79,172,254,0.28); box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .post-grid-card:hover { background: var(--surface) !important; }
        @media (max-width: 1023px) { .posts-grid-responsive { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 599px) { .posts-grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}