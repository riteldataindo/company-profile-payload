import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { FeaturesGrid } from '@/components/sections/FeaturesGrid'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: locale === 'id' ? 'Kapabilitas Analitik Retail dan Mall' : 'Retail and Mall Analytics Capabilities',
    description: locale === 'id'
      ? 'Tinjau tiga kelompok keputusan SmartCounter untuk Retail dan Mall: lalu lintas, alur dan zona, serta operasional—dengan definisi, prasyarat, batasan, dan status.'
      : 'Review three SmartCounter decision groups for Retail and Mall: traffic, flow and zones, and operations—with definitions, prerequisites, limitations, and status.',
    locale,
    path: '/features',
  })
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'Features', url: `/${locale}/features` },
      ])} />
      <FeaturesGrid
        locale={locale}
        headingLevel="h1"
      />
    </>
  )
}
