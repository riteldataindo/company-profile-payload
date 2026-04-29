'use client'

import { Sun, Moon, SunMoon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const modes = ['auto', 'light', 'dark'] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function cycle() {
    const idx = modes.indexOf(theme)
    setTheme(modes[(idx + 1) % modes.length])
  }

  return (
    <button
      onClick={cycle}
      className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${theme}`}
    >
      {theme === 'auto' && <SunMoon size={18} />}
      {theme === 'light' && <Sun size={18} />}
      {theme === 'dark' && <Moon size={18} />}
    </button>
  )
}
