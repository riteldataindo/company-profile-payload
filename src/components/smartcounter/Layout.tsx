'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  Globe2,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import type { Locale } from './i18n'
import { alternateLocale, route, sharedCopy, switchLocale, text } from './i18n'
import { ButtonLink, SmartLink } from './Primitives'

function closeOpenDetails(except: HTMLDetailsElement | null = null) {
  document.querySelectorAll<HTMLDetailsElement>('.nav-dropdown[open]').forEach((item) => {
    if (item !== except) item.open = false
  })
}

function Brand({ locale }: { locale: Locale }) {
  return (
    <SmartLink className="brand" href={route(locale)} aria-label={locale === 'id' ? 'Beranda SmartCounter' : 'SmartCounter home'}>
      <span className="brand__signal" aria-hidden="true" />
      <span className="brand__word">
        SMART<span>COUNTER</span>
      </span>
    </SmartLink>
  )
}

function applyTheme(next: 'light' | 'dark') {
  document.documentElement.dataset.theme = next
  document.documentElement.classList.toggle('dark', next === 'dark')
  document.documentElement.classList.toggle('light', next !== 'dark')
  localStorage.setItem('smartcounter-theme', next)
}

function ThemeToggle({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('smartcounter-theme')
    const next: 'light' | 'dark' = saved === 'dark' || saved === 'light'
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(next)
    applyTheme(next)
  }, [])

  const isDark = theme === 'dark'
  return (
    <button
      className="icon-button"
      type="button"
      onClick={() => {
        const next = isDark ? 'light' : 'dark'
        setTheme(next)
        applyTheme(next)
      }}
      aria-label={
        locale === 'id'
          ? isDark
            ? 'Gunakan mode terang'
            : 'Gunakan mode gelap'
          : isDark
            ? 'Use light mode'
            : 'Use dark mode'
      }
    >
      {isDark ? <Sun aria-hidden="true" size={19} /> : <Moon aria-hidden="true" size={19} />}
    </button>
  )
}

function DesktopDropdown({
  label,
  items,
  currentPath,
}: {
  label: string
  items: Array<{ label: string; href: string; description: string }>
  currentPath: string
}) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null)
  const summaryRef = useRef<HTMLElement | null>(null)
  return (
    <details
      ref={detailsRef}
      className="nav-dropdown"
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !event.currentTarget.open) return
        event.preventDefault()
        event.stopPropagation()
        event.currentTarget.open = false
        summaryRef.current?.focus()
      }}
    >
      <summary ref={summaryRef} onClick={() => closeOpenDetails(detailsRef.current)}>
        {label}
        <ChevronDown aria-hidden="true" size={15} />
      </summary>
      <div className="nav-dropdown__panel">
        {items.map((item) => (
          <SmartLink
            key={item.href}
            href={item.href}
            aria-current={currentPath === item.href ? 'page' : undefined}
            onClick={() => closeOpenDetails()}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </SmartLink>
        ))}
      </div>
    </details>
  )
}

export function SiteLayout({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const pathname = usePathname() || route(locale)
  const [locationSuffix, setLocationSuffix] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement | null>(null)
  const mobilePanel = useRef<HTMLDivElement | null>(null)
  const isId = locale === 'id'
  const otherLocale = alternateLocale(locale)
  const currentPath = pathname
  const currentLocation = `${pathname}${locationSuffix}`
  const otherLocaleHref = switchLocale(currentLocation, otherLocale)

  useEffect(() => {
    setLocationSuffix(`${window.location.search}${window.location.hash}`)
    setMobileOpen(false)
  }, [pathname])

  const solutionItems = [
    {
      label: isId ? 'Retail' : 'Retail',
      href: route(locale, '/solutions/retail'),
      description: isId ? 'Traffic toko, zone, dan multi-location.' : 'Store traffic, zones, and multi-location review.',
    },
    {
      label: isId ? 'Mall' : 'Mall',
      href: route(locale, '/solutions/mall'),
      description: isId ? 'Gate, lantai, zone, dan tenant context.' : 'Gate, floor, zone, and tenant context.',
    },
    {
      label: isId ? 'Kapabilitas' : 'Capabilities',
      href: route(locale, '/capabilities'),
      description: isId ? 'Definisi, unit, prasyarat, dan batasan.' : 'Definitions, units, prerequisites, and limits.',
    },
    {
      label: isId ? 'Paket' : 'Packages',
      href: route(locale, '/packages'),
      description: isId ? 'Core, Advanced Analytics, dan Enterprise.' : 'Core, Advanced Analytics, and Enterprise.',
    },
  ]

  const resourceItems = [
    {
      label: isId ? 'Panduan' : 'Guides',
      href: route(locale, '/guides'),
      description: isId ? 'Konten dasar untuk buyer dan operator.' : 'Foundational content for buyers and operators.',
    },
    {
      label: isId ? 'Validasi' : 'Validation',
      href: route(locale, '/validation'),
      description: isId ? 'Boundary, scope, dan representative checks.' : 'Boundaries, scope, and representative checks.',
    },
    {
      label: isId ? 'Deployment' : 'Deployment',
      href: route(locale, '/deployment'),
      description: isId ? 'Assessment, implementasi, dan dukungan lokal.' : 'Assessment, implementation, and local support.',
    },
    {
      label: 'FAQ',
      href: route(locale, '/faq'),
      description: isId ? 'Jawaban atas pertanyaan buyer utama.' : 'Answers to key buyer questions.',
    },
  ]

  useEffect(() => {
    if (!mobileOpen) return
    const firstLink = mobilePanel.current?.querySelector<HTMLElement>('a, button')
    firstLink?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        requestAnimationFrame(() => menuButton.current?.focus())
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Brand locale={locale} />

          <nav className="desktop-nav" aria-label={isId ? 'Navigasi utama' : 'Main navigation'}>
            <SmartLink
              href={route(locale, '/platform')}
              aria-current={currentPath === route(locale, '/platform') ? 'page' : undefined}
            >
              Platform
            </SmartLink>
            <DesktopDropdown label={isId ? 'Solusi' : 'Solutions'} items={solutionItems} currentPath={currentPath} />
            <DesktopDropdown label={isId ? 'Sumber' : 'Resources'} items={resourceItems} currentPath={currentPath} />
            <SmartLink
              href={route(locale, '/company')}
              aria-current={currentPath === route(locale, '/company') ? 'page' : undefined}
            >
              {isId ? 'Perusahaan' : 'Company'}
            </SmartLink>
          </nav>

          <div className="site-header__actions">
            <SmartLink className="locale-link" href={otherLocaleHref} lang={otherLocale}>
              <Globe2 aria-hidden="true" size={17} />
              {otherLocale.toUpperCase()}
            </SmartLink>
            <ThemeToggle locale={locale} />
            <ButtonLink className="site-header__cta" href={route(locale, '/demo')}>
              {text(locale, sharedCopy.seeInAction)}
            </ButtonLink>
            <button
              ref={menuButton}
              className="mobile-menu-button"
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? (isId ? 'Tutup menu' : 'Close menu') : isId ? 'Buka menu' : 'Open menu'}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X aria-hidden="true" size={23} /> : <Menu aria-hidden="true" size={23} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-navigation" className="mobile-nav" ref={mobilePanel}>
            <nav className="container" aria-label={isId ? 'Navigasi mobile' : 'Mobile navigation'}>
              <SmartLink href={route(locale, '/platform')} onClick={closeMobile}>
                Platform
              </SmartLink>
              <div className="mobile-nav__group">
                <span>{isId ? 'Solusi' : 'Solutions'}</span>
                {solutionItems.map((item) => (
                  <SmartLink key={item.href} href={item.href} onClick={closeMobile}>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </SmartLink>
                ))}
              </div>
              <div className="mobile-nav__group">
                <span>{isId ? 'Sumber' : 'Resources'}</span>
                {resourceItems.map((item) => (
                  <SmartLink key={item.href} href={item.href} onClick={closeMobile}>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </SmartLink>
                ))}
              </div>
              <SmartLink href={route(locale, '/company')} onClick={closeMobile}>
                {isId ? 'Perusahaan' : 'Company'}
              </SmartLink>
              <ButtonLink href={route(locale, '/demo')} onClick={closeMobile}>
                {text(locale, sharedCopy.seeInAction)}
              </ButtonLink>
              <SmartLink href={otherLocaleHref} lang={otherLocale} onClick={closeMobile}>
                {otherLocale === 'id' ? 'Bahasa Indonesia' : 'English'}
              </SmartLink>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div>
            <Brand locale={locale} />
            <p>{text(locale, sharedCopy.brandDescription)}</p>
            <p className="site-footer__identity">
              {isId
                ? 'SmartCounter adalah produk PT Ritel Data Indonesia.'
                : 'SmartCounter is a product of PT Ritel Data Indonesia.'}
            </p>
          </div>
          <div>
            <h2>{isId ? 'Jelajahi' : 'Explore'}</h2>
            <ul>
              <li><SmartLink href={route(locale, '/platform')}>Platform</SmartLink></li>
              <li><SmartLink href={route(locale, '/solutions/retail')}>Retail</SmartLink></li>
              <li><SmartLink href={route(locale, '/solutions/mall')}>Mall</SmartLink></li>
              <li><SmartLink href={route(locale, '/packages')}>{isId ? 'Paket' : 'Packages'}</SmartLink></li>
            </ul>
          </div>
          <div>
            <h2>{isId ? 'Kepercayaan' : 'Trust'}</h2>
            <ul>
              <li><SmartLink href={route(locale, '/validation')}>{isId ? 'Validasi' : 'Validation'}</SmartLink></li>
              <li><SmartLink href={route(locale, '/deployment')}>Deployment</SmartLink></li>
              <li><SmartLink href={route(locale, '/privacy')}>{isId ? 'Privasi' : 'Privacy'}</SmartLink></li>
              <li><SmartLink href={route(locale, '/terms')}>{isId ? 'Ketentuan' : 'Terms'}</SmartLink></li>
            </ul>
          </div>
          <div>
            <h2>{isId ? 'Kontak terverifikasi' : 'Verified contact'}</h2>
            <dl className="site-footer__contact">
              <div><dt>{isId ? 'Alamat' : 'Address'}</dt><dd>{text(locale, sharedCopy.notAvailable)}</dd></div>
              <div><dt>Email</dt><dd>{text(locale, sharedCopy.notAvailable)}</dd></div>
              <div><dt>WhatsApp</dt><dd>{text(locale, sharedCopy.notAvailable)}</dd></div>
            </dl>
            <SmartLink href={route(locale, '/contact')}>{text(locale, sharedCopy.discussSite)}</SmartLink>
          </div>
        </div>
        <div className="container site-footer__bottom">
          <span>© {new Date().getFullYear()} PT Ritel Data Indonesia</span>
          <span>{isId ? 'Presentasi publik device-neutral.' : 'Device-neutral public presentation.'}</span>
        </div>
      </footer>
    </>
  )
}
