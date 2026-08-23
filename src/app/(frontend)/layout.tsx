import type { Metadata } from 'next'
import { Fira_Code, Instrument_Sans } from 'next/font/google'
import { headers } from 'next/headers'
import { defaultLocale, isValidLocale } from '@/lib/i18n/config'
import { getMediaUrl, getSiteSettings } from '@/lib/data'
import { getSiteUrl } from '@/lib/seo/site'

const instrumentSans = Instrument_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans',
  weight: 'variable',
})

const firaCode = Fira_Code({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

const themeBootScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.classList.toggle('light',!d)}catch(e){document.documentElement.classList.add('dark')}})()`

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
  const siteUrl = getSiteUrl()

  return {
    ...(siteUrl && { metadataBase: siteUrl }),
    title: {
      default: `People Counting & Visitor Analytics Indonesia | ${siteName}`,
      template: '%s',
    },
    description,
    ...(favicon && { icons: { icon: favicon, shortcut: favicon } }),
    ...(!siteUrl && {
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    }),
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
    <html className={`${instrumentSans.variable} ${firaCode.variable}`} lang={locale} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootScript }} /></head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
