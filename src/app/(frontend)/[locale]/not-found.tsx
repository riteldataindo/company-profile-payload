'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, LayoutGrid, MapPinned, ShieldCheck, Play } from 'lucide-react'

export default function NotFound() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] === 'id' ? 'id' : 'en'
  const isId = locale === 'id'
  const quickLinks = [
    { href: `/${locale}/features`, icon: LayoutGrid, label: isId ? 'Kapabilitas' : 'Capabilities' },
    { href: `/${locale}/solutions/retail`, icon: MapPinned, label: isId ? 'Retail' : 'Retail' },
    { href: `/${locale}/privacy`, icon: ShieldCheck, label: isId ? 'Privasi' : 'Privacy' },
    { href: `/${locale}/demo`, icon: Play, label: 'Demo' },
  ]

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="relative max-w-xl">
        <div className="mb-[-2rem] select-none font-mono text-[8rem] font-bold leading-none text-text-muted/20 sm:text-[10rem]" aria-hidden="true">404</div>
        <p className="mb-4 inline-flex rounded-full border border-border-default px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
          {isId ? 'Halaman tidak ditemukan' : 'Page not found'}
        </p>
        <h1 className="mb-2 text-2xl font-bold">{isId ? 'Halaman ini tidak tersedia' : 'This page is not available'}</h1>
        <p className="mb-8 text-text-secondary">
          {isId ? 'Tautan mungkin sudah dipindahkan atau belum tersedia dalam versi situs ini.' : 'The link may have moved or may not be available in this version of the site.'}
        </p>
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <Link href={`/${locale}`} className="home-button home-button--primary">
            <Home size={16} aria-hidden="true" /> {isId ? 'Ke beranda' : 'Go home'}
          </Link>
          <Link href={`/${locale}/contact`} className="home-button home-button--secondary">
            <MessageCircle size={16} aria-hidden="true" /> {isId ? 'Hubungi kami' : 'Contact us'}
          </Link>
        </div>
        <p className="mb-3 text-xs text-text-muted">{isId ? 'Mungkin Anda mencari:' : 'You may be looking for:'}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border border-border-subtle bg-bg-card p-4 text-xs font-medium text-text-secondary">
              <Icon size={20} aria-hidden="true" />{label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
