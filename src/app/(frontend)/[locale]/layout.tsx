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
      <Navbar locale={locale} dict={dict} logo={logo} />
      <main>{children}</main>
      <Footer locale={locale} dict={dict} siteSettings={siteSettings} logo={logo} />
      <WhatsAppFloat dict={dict} siteSettings={siteSettings} />
      <ConsentAnalytics measurementId={measurementId} />
    </ThemeProvider>
  )
}
