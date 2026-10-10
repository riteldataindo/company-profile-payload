'use client'

import { Sun, Moon, SunMoon } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { useTheme } from './ThemeProvider'

const modes = ['auto', 'light', 'dark'] as const

export function ThemeToggle({ locale = 'en' }: { locale?: string }) {
  const { theme, setTheme } = useTheme()
  const [animate, setAnimate] = useState(false)
  const isId = locale === 'id'
  const idx = modes.indexOf(theme)
  const next = modes[(idx + 1) % modes.length]

  function cycle(event: MouseEvent<HTMLButtonElement>) {
    setAnimate(event.detail > 0)
    setTheme(next)
  }

  return (
    <button
      onClick={cycle}
      className="nav-state-button flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      aria-label={isId ? `Tema ${theme}. Ganti ke ${next}` : `Theme ${theme}. Switch to ${next}`}
      type="button"
    >
      <span className="state-icon" data-animate={animate ? 'true' : 'false'} aria-hidden="true">
        <SunMoon className="state-icon__glyph" data-active={theme === 'auto' ? 'true' : 'false'} size={18} />
        <Sun className="state-icon__glyph" data-active={theme === 'light' ? 'true' : 'false'} size={18} />
        <Moon className="state-icon__glyph" data-active={theme === 'dark' ? 'true' : 'false'} size={18} />
      </span>
    </button>
  )
}
