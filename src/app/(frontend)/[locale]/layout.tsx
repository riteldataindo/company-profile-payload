import '@/app/globals.css'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { getSiteSettings, getNavigation } from '@/lib/data'

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const [dict, siteSettings, navigation] = await Promise.all([
    getDictionary(locale as Locale),
    getSiteSettings(locale),
    getNavigation(locale),
  ])

  return (
    <ThemeProvider>
      <Navbar locale={locale} dict={dict} navigation={navigation} />
      <main>{children}</main>
      <Footer locale={locale} dict={dict} siteSettings={siteSettings} navigation={navigation} />
      <WhatsAppFloat dict={dict} siteSettings={siteSettings} />
    </ThemeProvider>
  )
}
