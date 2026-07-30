import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isIndexableLocale } from '@/lib/i18n/config'

const PUBLIC_FILE = /\.(.*)$/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/media') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameLocale) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-site-locale', pathnameLocale)
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    if (!isIndexableLocale(pathnameLocale)) {
      response.headers.set('X-Robots-Tag', 'noindex, follow')
    }
    return response
  }

  const cookieLocale = request.cookies.get('preferred-locale')?.value
  const detected = locales.find((l) => l === cookieLocale) || defaultLocale

  request.nextUrl.pathname = `/${detected}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|admin|api|media|favicon.ico).*)'],
}
