import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { defaultLocale, isValidLocale } from '@/lib/i18n/config'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcounter.id'),
  title: {
    default: 'People Counting & Visitor Analytics Indonesia | SmartCounter',
    template: '%s | SmartCounter',
  },
  description: 'People counting and visitor analytics software for retail stores, malls, and shopping centers in Indonesia.',
}

export default async function FrontendRootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers()
  const requestedLocale = requestHeaders.get('x-site-locale') || defaultLocale
  const locale = isValidLocale(requestedLocale) ? requestedLocale : defaultLocale

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
