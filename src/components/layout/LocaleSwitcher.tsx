'use client'

import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { locales } from '@/lib/i18n/config'

const localeLabels: Record<string, { label: string; flag: string }> = {
  en: { label: 'English', flag: 'EN' },
  id: { label: 'Indonesia', flag: 'ID' },
  ko: { label: '한국어', flag: 'KO' },
  ja: { label: '日本語', flag: 'JA' },
  zh: { label: '中文', flag: 'ZH' },
}

export function LocaleSwitcher({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchLocale(target: string) {
    const segments = pathname.split('/')
    segments[1] = target
    const newPath = segments.join('/')
    document.cookie = `preferred-locale=${target};path=/;max-age=31536000`
    window.location.href = newPath
  }

  const current = localeLabels[locale] || localeLabels.en

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
        aria-label="Switch language"
      >
        <Globe size={18} />
        <span className="text-xs font-semibold">{current.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-border-subtle bg-bg-card shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          {locales.map((loc) => {
            const item = localeLabels[loc]
            const isActive = loc === locale
            return (
              <button
                key={loc}
                onClick={() => { switchLocale(loc); setOpen(false) }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-500/10 font-semibold text-primary-400'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                }`}
              >
                <span className="w-6 text-center text-xs font-bold text-text-muted">{item.flag}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
