import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { FeaturesGrid } from '@/components/sections/FeaturesGrid'
import { getFeatures } from '@/lib/data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: 'People Counting & CCTV AI Features',
    description: 'Explore 12+ AI-powered visitor analytics features: visitor traffic, heatmaps, demographics, dwell time, occupancy, queuing, in-store routes, and more for retail stores and malls.',
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

  const [dict, features] = await Promise.all([
    getDictionary(locale as Locale),
    getFeatures(locale),
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'Features', url: `/${locale}/features` },
      ])} />
      <FeaturesGrid
        locale={locale}
        dict={dict}
        features={features}
        headingLevel="h1"
      />
    </>
  )
}
