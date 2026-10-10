import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { loadProfileContent } from '@/lib/profile/content'
import { CapabilitiesView } from '@/components/smartcounter/ProductViews'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const content = await loadProfileContent(locale)
  return <CapabilitiesView locale={locale} capabilities={content.capabilities} />
}
