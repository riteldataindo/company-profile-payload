import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { organizationSchema, websiteSchema, softwareApplicationSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSiteSettings } from '@/lib/data'
import { loadProfileContent } from '@/lib/profile/content'
import { HomeView } from '@/components/smartcounter/HomeView'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: locale === 'id'
      ? 'People Counting & Visitor Analytics untuk Retail dan Mall'
      : 'People Counting & Visitor Analytics for Retail and Mall',
    description: locale === 'id'
      ? 'SmartCounter menyatukan analytics Retail dan Mall dalam satu platform, dengan metric yang terdefinisi jelas, validasi representatif, dan dukungan implementasi lokal.'
      : 'SmartCounter brings Retail and Mall analytics into one platform, with clearly defined metrics, representative validation, and local implementation support.',
    locale,
    path: '',
  })
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const [siteSettings, content] = await Promise.all([
    getSiteSettings(locale),
    loadProfileContent(locale),
  ])
  return (
    <>
      <JsonLd data={organizationSchema(siteSettings)} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={softwareApplicationSchema()} />
      <HomeView locale={locale} packages={content.packages} faqGroups={content.faq} />
    </>
  )
}
