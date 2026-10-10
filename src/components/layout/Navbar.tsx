'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import { SmartCounterLogo } from '@/components/brand/SmartCounterLogo'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'

interface NavbarProps {
  locale: string
  dict: Record<string, any>
  logo?: {
    alt: string
    height: number
    url: string
    width: number
  }
}

const navItems = [
  { key: 'features', href: '/features', fallback: 'Features', fallbackId: 'Fitur' },
  { key: 'retail', href: '/solutions/retail', fallback: 'Retail', fallbackId: 'Retail' },
  { key: 'mall', href: '/solutions/mall', fallback: 'Mall', fallbackId: 'Mall' },
  { key: 'deployment', href: '/deployment', fallback: 'Deployment', fallbackId: 'Deployment' },
  { key: 'privacy', href: '/privacy', fallback: 'Privacy', fallbackId: 'Privasi' },
  { key: 'contact', href: '/contact', fallback: 'Contact', fallbackId: 'Hubungi Kami' },
]

export function Navbar({ locale, dict, logo }: NavbarProps) {
  const isId = locale === 'id'
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [animateMenu, setAnimateMenu] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    firstMenuLinkRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  function closeMenu() {
    setAnimateMenu(false)
    setMenuOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  function toggleMenu(event: MouseEvent<HTMLButtonElement>) {
    setAnimateMenu(event.detail > 0)
    setMenuOpen((open) => !open)
  }

  function isCurrent(href: string) {
    const target = `/${locale}${href}`
    return pathname === target || pathname.startsWith(`${target}/`)
  }

  return (
    <header className="site-header">
      <nav
        className="site-header__bar"
        aria-label={isId ? 'Navigasi utama' : 'Main navigation'}
      >
        <div className="site-header__inner">
          <Link href={`/${locale}`} className="shrink-0" aria-label={isId ? 'Beranda SmartCounter' : 'SmartCounter home'}>
            <SmartCounterLogo
              alt=""
              className="h-auto w-[132px] sm:w-[160px]"
              height={logo?.height}
              priority
              sizes="(min-width: 640px) 160px, 132px"
              src={logo?.url}
              width={logo?.width}
            />
          </Link>

          <ul className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => {
              const current = isCurrent(item.href)
              return (
                <li key={item.key}>
                  <Link
                    href={`/${locale}${item.href}`}
                    aria-current={current ? 'page' : undefined}
                    className={`site-nav-link ${current ? 'site-nav-link--current' : ''}`}
                  >
                    {dict.nav?.[item.key] || (locale === 'id' ? item.fallbackId : item.fallback)}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 lg:flex">
              <LocaleSwitcher locale={locale} />
              <ThemeToggle locale={locale} />
            </div>
            <Link
              href={`/${locale}/demo`}
              data-analytics-placement="navbar"
              className="home-button home-button--primary site-header__demo"
            >
              {dict.nav?.getDemo || (isId ? 'Minta demo site-fit' : 'Request a site-fit demo')}
            </Link>
            <button
              ref={menuButtonRef}
              className="nav-state-button inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] text-text-primary lg:hidden"
              onClick={toggleMenu}
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? (isId ? 'Tutup menu' : 'Close menu') : (isId ? 'Buka menu' : 'Open menu')}
              type="button"
            >
              <span className="state-icon" data-animate={animateMenu ? 'true' : 'false'} aria-hidden="true">
                <Menu className="state-icon__glyph" data-active={!menuOpen ? 'true' : 'false'} size={24} />
                <X className="state-icon__glyph" data-active={menuOpen ? 'true' : 'false'} size={24} />
              </span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="mobile-navigation"
            className="nav-popover mt-3 max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain rounded-[16px] border border-border-subtle bg-bg-surface p-4 shadow-lg lg:hidden"
            data-animate={animateMenu ? 'true' : 'false'}
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item, index) => {
                const current = isCurrent(item.href)
                return (
                  <li key={item.key}>
                    <Link
                      ref={index === 0 ? firstMenuLinkRef : undefined}
                      href={`/${locale}${item.href}`}
                      aria-current={current ? 'page' : undefined}
                      className={`block min-h-11 rounded-[10px] px-4 py-3 text-sm font-medium ${current ? 'bg-bg-card text-text-primary' : 'text-text-secondary'}`}
                      onClick={closeMenu}
                    >
                      {dict.nav?.[item.key] || (locale === 'id' ? item.fallbackId : item.fallback)}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="mt-3 flex items-center gap-2 border-t border-border-subtle pt-3">
              <LocaleSwitcher locale={locale} />
              <ThemeToggle locale={locale} />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
