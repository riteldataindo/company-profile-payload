import '@/app/globals.css'
import '@/styles/smartcounter/base.css'
import '@/styles/smartcounter/home.css'
import '@/styles/smartcounter/product.css'
import '@/styles/smartcounter/resources.css'
import '@/styles/smartcounter/responsive.css'
import '@/styles/smartcounter/release.css'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { SiteLayout } from '@/components/smartcounter/Layout'
import { getSiteSettings } from '@/lib/data'
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

  const siteSettings = await getSiteSettings(locale)
  const measurementId = typeof siteSettings?.googleAnalyticsId === 'string'
    && /^G-[A-Z0-9]{5,20}$/.test(siteSettings.googleAnalyticsId)
    ? siteSettings.googleAnalyticsId
    : undefined
  const activeLocale = locale as Locale

  return (
    <>
      <a className="skip-link" href="#main-content">
        {activeLocale === 'id' ? 'Lewati ke konten utama' : 'Skip to main content'}
      </a>
      <SiteLayout locale={activeLocale}>{children}</SiteLayout>
      <ConsentAnalytics locale={activeLocale} measurementId={measurementId} />
    </>
  )
}
