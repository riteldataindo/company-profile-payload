import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  allLocales,
  defaultLocale,
  isInactiveLocale,
  isValidLocale,
} from '@/lib/i18n/config'

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

  const pathnameLocale = allLocales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameLocale) {
    if (isInactiveLocale(pathnameLocale)) {
      const redirectUrl = request.nextUrl.clone()
      const remainder = pathname.slice(pathnameLocale.length + 1)
      redirectUrl.pathname = `/${defaultLocale}${remainder}` || `/${defaultLocale}`
      const response = NextResponse.redirect(redirectUrl)
      response.headers.set('X-Robots-Tag', 'noindex, follow')
      return response
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-site-locale', pathnameLocale)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const cookieLocale = request.cookies.get('preferred-locale')?.value
  const detected = cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : defaultLocale

  request.nextUrl.pathname = `/${detected}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|admin|api|media|favicon.ico).*)'],
}
