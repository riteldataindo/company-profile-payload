import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { defaultLocale, isValidLocale } from '@/lib/i18n/config'
import { getMediaUrl, getSiteSettings } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers()
  const requestedLocale = requestHeaders.get('x-site-locale') || defaultLocale
  const locale = isValidLocale(requestedLocale) ? requestedLocale : defaultLocale
  const settings = await getSiteSettings(locale)
  const siteName = settings?.siteName || 'SmartCounter'
  const description = settings?.siteDescription
    || 'People counting and visitor analytics software for retail stores, malls, and shopping centers in Indonesia.'
  const favicon = getMediaUrl(settings?.favicon)
  const defaultOgImage = getMediaUrl(settings?.defaultOgImage)

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcounter.id'),
    title: {
      default: `People Counting & Visitor Analytics Indonesia | ${siteName}`,
      template: `%s | ${siteName}`,
    },
    description,
    ...(favicon && { icons: { icon: favicon, shortcut: favicon } }),
    openGraph: {
      description,
      siteName,
      ...(defaultOgImage && { images: [defaultOgImage] }),
    },
  }
}

export default async function FrontendRootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers()
  const requestedLocale = requestHeaders.get('x-site-locale') || defaultLocale
  const locale = isValidLocale(requestedLocale) ? requestedLocale : defaultLocale

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Shared document-level font stylesheet for all locale routes. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
