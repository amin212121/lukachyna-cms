'use client'

import React, { useEffect, useState } from 'react'

import { useTheme } from '..'

export const ThemeSelector: React.FC = () => {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Avoid hydration mismatch — reserve space until mounted
  if (!mounted) return <div className="size-9" />

  const isDark = theme === 'dark'

  return (
    <button
      className="relative size-9 opacity-60 transition-opacity duration-200 hover:opacity-100"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 207.628 207.628"
          fill="currentColor"
          className="w-full h-full"
        >
          <circle cx="103.814" cy="103.814" r="45.868" />
          <path d="M103.814 157.183c-29.427 0-53.368-23.941-53.368-53.368s23.941-53.368 53.368-53.368 53.368 23.941 53.368 53.368-23.941 53.368-53.368 53.368zm0-91.737c-21.156 0-38.368 17.212-38.368 38.368s17.212 38.368 38.368 38.368 38.368-17.212 38.368-38.368-17.212-38.368-38.368-38.368zM103.814 39.385a7.5 7.5 0 0 1-7.5-7.5V7.5a7.5 7.5 0 0 1 15 0v24.385a7.5 7.5 0 0 1-7.5 7.5zM103.814 207.628a7.5 7.5 0 0 1-7.5-7.5v-24.385a7.5 7.5 0 0 1 15 0v24.385a7.5 7.5 0 0 1-7.5 7.5zM200.128 111.314h-24.385a7.5 7.5 0 0 1 0-15h24.385a7.5 7.5 0 0 1 0 15zM31.885 111.314H7.5a7.5 7.5 0 0 1 0-15h24.385a7.5 7.5 0 0 1 0 15zM154.676 60.452a7.474 7.474 0 0 1-5.303-2.197 7.5 7.5 0 0 1 0-10.606l17.243-17.242a7.498 7.498 0 0 1 10.606 0 7.5 7.5 0 0 1 0 10.606l-17.243 17.242a7.474 7.474 0 0 1-5.303 2.197zM35.709 179.419a7.474 7.474 0 0 1-5.303-2.197 7.5 7.5 0 0 1 0-10.606l17.243-17.243a7.5 7.5 0 0 1 10.606 0 7.5 7.5 0 0 1 0 10.606l-17.243 17.243a7.472 7.472 0 0 1-5.303 2.197zM171.918 179.419a7.474 7.474 0 0 1-5.303-2.197l-17.243-17.243a7.5 7.5 0 0 1 0-10.606 7.5 7.5 0 0 1 10.606 0l17.243 17.243a7.5 7.5 0 0 1 0 10.606 7.472 7.472 0 0 1-5.303 2.197zM52.952 60.452a7.474 7.474 0 0 1-5.303-2.197L30.406 41.013a7.5 7.5 0 0 1 0-10.606 7.498 7.498 0 0 1 10.606 0l17.243 17.242a7.5 7.5 0 0 1 0 10.606 7.472 7.472 0 0 1-5.303 2.197z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}