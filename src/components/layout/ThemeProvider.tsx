'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  resolved: 'dark',
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'auto') return getSystemTheme()
  return theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('auto')
  const [resolved, setResolved] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const initial = stored && ['light', 'dark', 'auto'].includes(stored) ? stored : 'auto'
    setThemeState(initial)
    setResolved(resolveTheme(initial))
  }, [])

  useEffect(() => {
    const r = resolveTheme(theme)
    setResolved(r)
    document.documentElement.classList.toggle('dark', r === 'dark')
    document.documentElement.classList.toggle('light', r === 'light')
  }, [theme])

  useEffect(() => {
    if (theme !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const r = resolveTheme('auto')
      setResolved(r)
      document.documentElement.classList.toggle('dark', r === 'dark')
      document.documentElement.classList.toggle('light', r === 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  function setTheme(t: Theme) {
    setThemeState(t)
    localStorage.setItem('theme', t)
  }

  return (
    <ThemeContext value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext>
  )
}
