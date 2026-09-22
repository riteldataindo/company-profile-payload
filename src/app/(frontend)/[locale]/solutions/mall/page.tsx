import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { SolutionView } from '@/components/smartcounter/ProductViews'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  return <SolutionView locale={locale} kind="mall" />
}
