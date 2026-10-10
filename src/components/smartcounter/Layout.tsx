'use client'

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { usePathname } from 'next/navigation'
import {
  ArrowUp,
  BookOpen,
  Building2,
  ChevronDown,
  CircleHelp,
  Globe2,
  Layers3,
  Moon,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sun,
  Wrench,
} from 'lucide-react'
import { SmartCounterLogo } from '@/components/brand/SmartCounterLogo'
import type { Locale } from './i18n'
import { alternateLocale, route, sharedCopy, switchLocale, text } from './i18n'
import { ButtonLink, SmartLink } from './Primitives'
import { whatsappHref, type CompanyContact } from '@/lib/profile/contact'
import { heroCopy } from './landing/copy'

type NavItem = {
  label: string
  href: string
  description: string
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean | 'true' }>
}

function closeOpenDetails(except: HTMLDetailsElement | null = null) {
  document.querySelectorAll<HTMLDetailsElement>('.nav-dropdown[open]').forEach((item) => {
    if (item !== except) item.open = false
  })
}

function Brand({ locale, priority = false }: { locale: Locale; priority?: boolean }) {
  return (
    <SmartLink className="brand" href={route(locale)} aria-label={locale === 'id' ? 'Beranda SmartCounter' : 'SmartCounter home'}>
      <SmartCounterLogo className="brand__logo" alt="" priority={priority} sizes="190px" />
    </SmartLink>
  )
}

function applyTheme(next: 'light' | 'dark') {
  document.documentElement.dataset.theme = next
  document.documentElement.classList.toggle('dark', next === 'dark')
  document.documentElement.classList.toggle('light', next !== 'dark')
  try {
    localStorage.setItem('smartcounter-theme', next)
  } catch {
    // Storage can be unavailable in private windows; the theme still applies.
  }
  window.dispatchEvent(new CustomEvent('smartcounter-theme', { detail: next }))
}

type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> }
}

function ThemeToggle({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const button = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem('smartcounter-theme')
    } catch {
      saved = null
    }
    const next: 'light' | 'dark' = saved === 'dark' || saved === 'light'
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(next)
    applyTheme(next)
    const onTheme = (event: Event) => {
      const value = (event as CustomEvent<'light' | 'dark'>).detail
      if (value === 'light' || value === 'dark') setTheme(value)
    }
    window.addEventListener('smartcounter-theme', onTheme)
    return () => window.removeEventListener('smartcounter-theme', onTheme)
  }, [])

  const isDark = theme === 'dark'

  const toggle = () => {
    const next = isDark ? 'light' : 'dark'
    const doc = document as TransitionDocument
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduce || !button.current) {
      setTheme(next)
      applyTheme(next)
      return
    }
    const rect = button.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    document.documentElement.dataset.themeSwitching = 'true'
    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next))
      applyTheme(next)
    })
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 560, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        ).finished.finally(() => {
          delete document.documentElement.dataset.themeSwitching
        })
      })
      .catch(() => {
        delete document.documentElement.dataset.themeSwitching
      })
  }

  return (
    <button
      ref={button}
      className="icon-button theme-toggle"
      type="button"
      onClick={toggle}
      data-theme-state={theme}
      aria-label={
        locale === 'id'
          ? isDark ? 'Gunakan mode terang' : 'Gunakan mode gelap'
          : isDark ? 'Use light mode' : 'Use dark mode'
      }
    >
      <span className="theme-toggle__icons" aria-hidden="true">
        <Sun size={18} />
        <Moon size={18} />
      </span>
    </button>
  )
}

function DesktopDropdown({
  label,
  items,
  currentPath,
}: {
  label: string
  items: NavItem[]
  currentPath: string
}) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null)
  const summaryRef = useRef<HTMLElement | null>(null)
  const active = items.some((item) => item.href === currentPath)
  return (
    <details
      ref={detailsRef}
      className="nav-dropdown"
      data-active={active ? 'true' : 'false'}
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
        {items.map((item) => {
          const Icon = item.icon
          return (
            <SmartLink
              key={item.href}
              href={item.href}
              aria-current={currentPath === item.href ? 'page' : undefined}
              onClick={() => closeOpenDetails()}
            >
              <span className="nav-dropdown__icon"><Icon aria-hidden="true" size={17} /></span>
              <span className="nav-dropdown__text">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </span>
            </SmartLink>
          )
        })}
      </div>
    </details>
  )
}

export function SiteLayout({
  locale,
  contact,
  children,
}: {
  locale: Locale
  contact: CompanyContact
  children: React.ReactNode
}) {
  const pathname = usePathname() || route(locale)
  const [locationSuffix, setLocationSuffix] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButton = useRef<HTMLButtonElement | null>(null)
  const mobilePanel = useRef<HTMLDivElement | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const isId = locale === 'id'
  const otherLocale = alternateLocale(locale)
  const currentPath = pathname
  const currentLocation = `${pathname}${locationSuffix}`
  const otherLocaleHref = switchLocale(currentLocation, otherLocale)

  useEffect(() => {
    setLocationSuffix(`${window.location.search}${window.location.hash}`)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target?.closest('.nav-dropdown')) closeOpenDetails()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const solutionItems: NavItem[] = [
    {
      label: 'Retail',
      href: route(locale, '/solutions/retail'),
      description: isId ? 'Traffic toko, zone, dan multi-location.' : 'Store traffic, zones, and multi-location review.',
      icon: ShoppingBag,
    },
    {
      label: 'Mall',
      href: route(locale, '/solutions/mall'),
      description: isId ? 'Gate, lantai, zone, dan tenant context.' : 'Gate, floor, zone, and tenant context.',
      icon: Building2,
    },
    {
      label: isId ? 'Kapabilitas' : 'Capabilities',
      href: route(locale, '/capabilities'),
      description: isId ? 'Definisi, unit, prasyarat, dan batasan.' : 'Definitions, units, prerequisites, and limits.',
      icon: Layers3,
    },
    {
      label: isId ? 'Paket' : 'Packages',
      href: route(locale, '/packages'),
      description: isId ? 'Core, Advanced Analytics, dan Enterprise.' : 'Core, Advanced Analytics, and Enterprise.',
      icon: Package,
    },
  ]

  const resourceItems: NavItem[] = [
    {
      label: isId ? 'Panduan' : 'Guides',
      href: route(locale, '/guides'),
      description: isId ? 'Konten dasar untuk buyer dan operator.' : 'Foundational content for buyers and operators.',
      icon: BookOpen,
    },
    {
      label: isId ? 'Validasi' : 'Validation',
      href: route(locale, '/validation'),
      description: isId ? 'Boundary, scope, dan representative checks.' : 'Boundaries, scope, and representative checks.',
      icon: ShieldCheck,
    },
    {
      label: 'Deployment',
      href: route(locale, '/deployment'),
      description: isId ? 'Assessment, implementasi, dan dukungan lokal.' : 'Assessment, implementation, and local support.',
      icon: Wrench,
    },
    {
      label: 'FAQ',
      href: route(locale, '/faq'),
      description: isId ? 'Jawaban atas pertanyaan buyer utama.' : 'Answers to key buyer questions.',
      icon: CircleHelp,
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

  const moveIndicator = (element: Element | null) => {
    const nav = navRef.current
    if (!nav) return
    if (!element) {
      nav.style.setProperty('--ind-o', '0')
      return
    }
    const box = element.getBoundingClientRect()
    const frame = nav.getBoundingClientRect()
    nav.style.setProperty('--ind-x', `${box.left - frame.left}px`)
    nav.style.setProperty('--ind-w', `${box.width}px`)
    nav.style.setProperty('--ind-o', '1')
  }

  const indicatorTarget = (target: EventTarget | null) =>
    (target as Element | null)?.closest?.('.desktop-nav > a, .nav-dropdown > summary') ?? null

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header className="site-header" data-scrolled={scrolled ? 'true' : 'false'} data-menu={mobileOpen ? 'open' : 'closed'}>
        <div className="container site-header__inner">
          <Brand locale={locale} priority />

          <nav
            ref={navRef}
            className="desktop-nav"
            aria-label={isId ? 'Navigasi utama' : 'Main navigation'}
            onPointerOver={(event) => {
              const target = indicatorTarget(event.target)
              if (target) moveIndicator(target)
            }}
            onPointerLeave={() => moveIndicator(null)}
            onFocus={(event) => moveIndicator(indicatorTarget(event.target))}
            onBlur={() => moveIndicator(null)}
          >
            <span className="desktop-nav__indicator" aria-hidden="true" />
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
            <SmartLink className="locale-link" href={otherLocaleHref} lang={otherLocale} hrefLang={otherLocale}>
              <Globe2 aria-hidden="true" size={16} />
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
              <span className="burger" aria-hidden="true"><i /><i /></span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-navigation" className="mobile-nav" ref={mobilePanel}>
            <nav className="container" aria-label={isId ? 'Navigasi mobile' : 'Mobile navigation'}>
              <SmartLink href={route(locale, '/platform')} onClick={closeMobile}>
                <strong>Platform</strong>
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
                <strong>{isId ? 'Perusahaan' : 'Company'}</strong>
              </SmartLink>
              <div className="mobile-nav__footer">
                <ButtonLink href={route(locale, '/demo')} onClick={closeMobile}>
                  {text(locale, sharedCopy.seeInAction)}
                </ButtonLink>
                <div className="mobile-nav__prefs">
                  <SmartLink className="locale-link" href={otherLocaleHref} lang={otherLocale} hrefLang={otherLocale} onClick={closeMobile}>
                    <Globe2 aria-hidden="true" size={16} />
                    {otherLocale === 'id' ? 'Bahasa Indonesia' : 'English'}
                  </SmartLink>
                  <ThemeToggle locale={locale} />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div className="site-footer__brand">
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
            <h2>{isId ? 'Perusahaan' : 'Company'}</h2>
            <ul>
              <li><SmartLink href={route(locale, '/company')}>{isId ? 'Tentang kami' : 'About us'}</SmartLink></li>
              <li><SmartLink href={route(locale, '/validation')}>{isId ? 'Validasi' : 'Validation'}</SmartLink></li>
              <li><SmartLink href={route(locale, '/deployment')}>Deployment</SmartLink></li>
              <li><SmartLink href={route(locale, '/privacy')}>{isId ? 'Privasi' : 'Privacy'}</SmartLink></li>
              <li><SmartLink href={route(locale, '/terms')}>{isId ? 'Ketentuan' : 'Terms'}</SmartLink></li>
            </ul>
          </div>
          <div>
            <h2>{isId ? 'Kontak' : 'Contact'}</h2>
            <dl className="site-footer__contact">
              <div>
                <dt>Email</dt>
                <dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd><a href={whatsappHref(contact, text(locale, heroCopy.whatsappMessage))} target="_blank" rel="noopener noreferrer">{contact.whatsappDisplay}</a></dd>
              </div>
              <div>
                <dt>{isId ? 'Kantor' : 'Office'}</dt>
                <dd>{contact.address}</dd>
              </div>
            </dl>
            <SmartLink className="site-footer__cta" href={route(locale, '/demo')}>{text(locale, sharedCopy.seeInAction)}</SmartLink>
          </div>
        </div>
        <div className="container site-footer__mark" aria-hidden="true">
          <span className="site-footer__wordmark" />
        </div>
        <div className="container site-footer__bottom">
          <span>© {new Date().getFullYear()} PT Ritel Data Indonesia</span>
          <a className="site-footer__top" href="#main-content">
            {isId ? 'Kembali ke atas' : 'Back to top'}
            <ArrowUp aria-hidden="true" size={15} />
          </a>
        </div>
      </footer>
    </>
  )
}
