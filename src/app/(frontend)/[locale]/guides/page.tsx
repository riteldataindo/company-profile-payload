import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { loadProfileContent } from '@/lib/profile/content'
import { GuidesView } from '@/components/smartcounter/ResourceViews'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const content = await loadProfileContent(locale)
  return <GuidesView locale={locale} guides={content.guides} />
}
