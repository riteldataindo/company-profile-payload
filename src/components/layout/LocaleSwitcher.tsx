'use client'

import { usePathname } from 'next/navigation'
import { ChevronDown, Globe } from 'lucide-react'
import { indexableLocales } from '@/lib/i18n/config'

const localeLabels: Record<string, { label: string; flag: string }> = {
  en: { label: 'English', flag: 'EN' },
  id: { label: 'Indonesia', flag: 'ID' },
}

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  const isId = locale === 'id'

  function switchLocale(target: string) {
    const alternate = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${target}"]`,
    )
    if (alternate) {
      const alternateUrl = new URL(alternate.href, window.location.origin)
      if (alternateUrl.origin === window.location.origin) {
        alternateUrl.search = window.location.search
        alternateUrl.hash = window.location.hash
        document.cookie = `preferred-locale=${target};path=/;max-age=31536000;samesite=lax`
        window.location.href = `${alternateUrl.pathname}${alternateUrl.search}${alternateUrl.hash}`
        return
      }
    }

    const segments = pathname.split('/')
    segments[1] = target
    const newPath = segments.join('/')
    document.cookie = `preferred-locale=${target};path=/;max-age=31536000;samesite=lax`
    window.location.href = `${newPath}${window.location.search}${window.location.hash}`
  }

  return (
    <div className="relative text-text-secondary">
      <Globe className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" size={18} aria-hidden="true" />
      <select
        aria-label={isId ? 'Ganti bahasa' : 'Switch language'}
        className="min-h-11 appearance-none rounded-lg bg-transparent py-2 pl-8 pr-8 text-xs font-semibold transition-colors hover:bg-bg-card hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        onChange={(event) => switchLocale(event.target.value)}
        value={locale}
      >
        {indexableLocales.map((target) => {
          const item = localeLabels[target]
          return <option key={target} value={target}>{item.flag}</option>
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" size={14} aria-hidden="true" />
    </div>
  )
}
