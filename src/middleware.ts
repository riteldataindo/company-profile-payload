import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/lib/i18n/config'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request: NextRequest) {
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

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return NextResponse.next()

  const cookieLocale = request.cookies.get('preferred-locale')?.value
  const acceptLang = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0]
  const detected = locales.find((l) => l === cookieLocale) ||
    locales.find((l) => l === acceptLang) ||
    defaultLocale

  request.nextUrl.pathname = `/${detected}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|admin|api|media|favicon.ico).*)'],
}
