import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { CompanyView } from '@/components/smartcounter/CompanyViews'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  return <CompanyView locale={locale} />
}
