'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Publications', href: '/publications' },
  { label: 'Contact', href: '/contact' },
]

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data: _data }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const [theme, setTheme] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev
      document.body.style.overflow = next ? 'hidden' : ''
      return next
    })
  }

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = ''
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <header
        className="container flex items-center py-6 lg:py-10 relative z-20"
        {...(theme ? { 'data-theme': theme } : {})}
      >
        {/* Hamburger (mobile only) */}
        <button
          className="flex flex-col justify-center gap-[6px] p-1 mr-4 lg:hidden shrink-0"
          onClick={toggleMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-foreground rounded-sm transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground rounded-sm transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground rounded-sm transition-transform duration-300 ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-bold text-foreground hover:text-primary transition-colors duration-200 flex-1 lg:flex-none lg:mr-6"
          style={{ letterSpacing: '-0.01em' }}
        >
          Lukachyna
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:block mr-auto">
          <ul className="flex items-center gap-10 list-none p-0 m-0">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-[0.1em] hover:text-foreground transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3 ml-auto lg:ml-0">
          <ThemeSelector />
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/55 backdrop-blur-md transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
        />

        {/* Slide-in panel */}
        <div
          className={`absolute inset-y-0 left-0 w-[min(300px,80vw)] bg-card border-r border-border px-5 py-6 flex flex-col overflow-y-auto transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          {/* Panel top row */}
          <div className="flex items-center justify-between mb-10">
            <Link
              href="/"
              onClick={closeMenu}
              className="font-display text-xl font-bold text-foreground"
            >
              Lukachyna
            </Link>
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav>
            <ul className="flex flex-col list-none p-0 m-0">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className="block py-[0.85rem] px-[0.875rem] font-mono text-xs font-medium text-muted-foreground uppercase tracking-[0.1em] rounded-md hover:text-foreground hover:bg-white/5 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}