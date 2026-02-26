import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/stepan-lukachyna-837b651b7/' },
  { label: 'Github', href: 'https://github.com/amin212121' },
]

const FALLBACK_NAV = [
  { label: 'Info', href: '/' },
  { label: 'Contact', href: '/contact' },
]

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono), 'DM Mono', monospace",
  fontSize: '0.68rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-muted)',
  cursor: 'pointer',
  position: 'relative',
  transition: 'color 0.3s ease',
}

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto">
      {/* Gradient top border — exact match to website's 45% stop */}
      <div
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, var(--color-ember) 0%, var(--color-accent) 45%, transparent 100%)',
        }}
      />

      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

          {/* Left nav */}
          <ul
            style={{
              gridColumn: 1,
              gridRow: 1,
              listStyle: 'none',
              padding: 0,
              margin: '0 0 3rem',
              display: 'flex',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {navItems.length > 0
              ? navItems.map(({ link }, i) => (
                  <li key={i} style={{ position: 'relative' }} className="footer-nav-item">
                    <CMSLink className="footer-nav-link" {...link} />
                    <span className="footer-underline footer-underline--accent" />
                  </li>
                ))
              : FALLBACK_NAV.map(({ label, href }) => (
                  <li key={href} style={{ position: 'relative' }} className="footer-nav-item">
                    <Link href={href} className="footer-nav-link">
                      {label}
                    </Link>
                    <span className="footer-underline footer-underline--accent" />
                  </li>
                ))}
          </ul>

          {/* Right social */}
          <ul
            style={{
              gridColumn: 2,
              gridRow: 1,
              listStyle: 'none',
              padding: 0,
              margin: '0 0 3rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label} style={{ position: 'relative' }} className="footer-nav-item">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  {label}
                </a>
                <span className="footer-underline footer-underline--ember" />
              </li>
            ))}
          </ul>

          {/* Copyright */}
          <div
            style={{
              gridColumn: '1 / -1',
              gridRow: 2,
              borderTop: '1px solid var(--color-border)',
              paddingTop: '1.75rem',
              marginBottom: '1rem',
              fontFamily: "var(--font-mono), 'DM Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              opacity: 0.5,
            }}
          >
            © {new Date().getFullYear()} Lukachyna Stepan
          </div>

          {/* Quote */}
          <p
            style={{
              gridColumn: '1 / -1',
              gridRow: 3,
              fontFamily: "var(--font-sans), 'Plus Jakarta Sans', sans-serif",
              fontWeight: 300,
              fontSize: '0.95rem',
              lineHeight: 1.85,
              color: 'var(--color-muted)',
              opacity: 0.75,
              margin: 0,
            }}
          >
            <b style={bStyle}>Success</b>{' '}
            {'- in the details. '}
            <b style={bStyle}>Genius</b>{' '}
            {'— making complex ideas simple, not making simple ideas complex. '}
            <b style={bStyle}>Growth</b>{' '}
            {'— teaching others is the deepest form of understanding.'}
          </p>

        </div>
      </div>

      <style>{`
        .footer-nav-link {
          font-family: var(--font-mono), 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-muted);
          transition: color 0.3s ease;
        }
        .footer-nav-item:hover .footer-nav-link {
          color: var(--text);
        }
        .footer-underline {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .footer-underline--accent { background: var(--color-accent); }
        .footer-underline--ember  { background: var(--color-ember); }
        .footer-nav-item:hover .footer-underline { width: 100%; }
      `}</style>
    </footer>
  )
}

const bStyle: React.CSSProperties = {
  fontFamily: "var(--font-display), 'Big Shoulders Display', sans-serif",
  fontWeight: 900,
  fontSize: '1.4em',
  letterSpacing: '0.04em',
  color: 'var(--color-ember)',
  fontStyle: 'normal',
  display: 'inline-block',
  lineHeight: 1,
  verticalAlign: 'middle',
  marginRight: '0.05em',
}