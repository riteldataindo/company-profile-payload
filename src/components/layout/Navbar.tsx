'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'

interface NavbarProps {
  locale: string
  dict: Record<string, any>
}

const navItems = [
  { key: 'features', href: '/features' },
  { key: 'useCases', href: '/use-cases' },
  { key: 'packages', href: '/packages' },
  { key: 'faq', href: '/faq' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/contact' },
]

export function Navbar({ locale, dict }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 px-4 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-base/85 backdrop-blur-xl shadow-[0_1px_0_var(--color-border-subtle)]'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="SmartCounter Home">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-logo-red" style={{ fontVariant: 'small-caps' }}>SMART</span>
            <span className="text-text-primary">Counter</span>
          </span>
        </Link>

        <ul className="hidden gap-7 md:flex">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={`/${locale}${item.href}`}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {dict.nav[item.key]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
          <Link
            href={`/${locale}/demo`}
            className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          >
            {dict.nav.getDemo}
          </Link>
          <button
            className="text-text-primary md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-border-subtle bg-bg-surface p-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
              onClick={() => setMenuOpen(false)}
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
