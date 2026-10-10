'use client'

import { usePathname } from 'next/navigation'
import { ButtonLink, PageHero } from '@/components/smartcounter/Primitives'
import { route, type Locale } from '@/components/smartcounter/i18n'

export default function NotFound() {
  const pathname = usePathname()
  const locale: Locale = pathname?.split('/').filter(Boolean)[0] === 'id' ? 'id' : 'en'
  const isId = locale === 'id'

  return (
    <PageHero
      compact
      eyebrow="404"
      title={isId ? 'Halaman tidak ditemukan.' : 'Page not found.'}
      description={isId ? 'Route ini tidak tersedia pada implementation branch.' : 'This route is not available in the implementation branch.'}
      actions={<ButtonLink href={route(locale)}>{isId ? 'Kembali ke beranda' : 'Return home'}</ButtonLink>}
    />
  )
}
