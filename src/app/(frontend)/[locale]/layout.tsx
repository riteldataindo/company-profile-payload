import '@/app/globals.css'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const dict = await getDictionary(locale as Locale)

  return (
    <ThemeProvider>
      <Navbar locale={locale} dict={dict} />
      <main>{children}</main>
      <Footer locale={locale} dict={dict} />
      <WhatsAppFloat dict={dict} />
    </ThemeProvider>
  )
}
