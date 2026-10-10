import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { loadProfileContent } from '@/lib/profile/content'
import { guides } from '@/lib/profile/guideData'
import { GuideArticle } from '@/components/smartcounter/ResourceViews'

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  const content = await loadProfileContent(locale)
  const guide = content.guides.find((item) => item.slug === slug)
  const source = guides.find((item) => item.slug === slug)
  if (!guide && !source) notFound()
  return (
    <GuideArticle
      locale={locale}
      title={guide?.title || source?.title[locale] || slug}
      description={guide?.description || source?.description[locale] || ''}
      updated={source?.updated}
      sections={source?.sections ?? []}
    />
  )
}
