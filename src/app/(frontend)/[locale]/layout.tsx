import '@/app/globals.css'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { getMediaUrl, getSiteSettings } from '@/lib/data'
import { ConsentAnalytics } from '@/components/analytics/ConsentAnalytics'

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const [dict, siteSettings] = await Promise.all([
    getDictionary(locale as Locale),
    getSiteSettings(locale),
  ])
  const logoMedia = siteSettings?.logo && typeof siteSettings.logo === 'object'
    ? siteSettings.logo
    : null
  const logoUrl = getMediaUrl(logoMedia)
  const logo = logoUrl
    ? {
        alt: logoMedia?.alt || siteSettings?.siteName || 'SmartCounter',
        height: logoMedia?.height || 236,
        url: logoUrl,
        width: logoMedia?.width || 1600,
      }
    : undefined
  const measurementId = typeof siteSettings?.googleAnalyticsId === 'string'
    && /^G-[A-Z0-9]{5,20}$/.test(siteSettings.googleAnalyticsId)
    ? siteSettings.googleAnalyticsId
    : undefined

  return (
    <ThemeProvider>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-bg-card px-4 py-2 text-sm text-text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        {locale === 'id' ? 'Lewati ke konten utama' : 'Skip to main content'}
      </a>
      <Navbar locale={locale} dict={dict} logo={logo} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer locale={locale} dict={dict} siteSettings={siteSettings} logo={logo} />
      <WhatsAppFloat dict={dict} siteSettings={siteSettings} />
      <ConsentAnalytics locale={locale} measurementId={measurementId} />
    </ThemeProvider>
  )
}
