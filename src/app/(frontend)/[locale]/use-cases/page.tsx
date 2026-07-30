import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { UseCasesShowcase } from '@/components/sections/UseCasesShowcase'
import { getUseCases } from '@/lib/data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: 'Use Cases — SmartCounter CCTV Analytics for Retail Indonesia',
    description: 'See how SmartCounter people counting works for retail stores, malls, fashion, pharmacies, supermarkets, and luxury retail.',
    locale,
    path: '/use-cases',
  })
}

export default async function UseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const [dict, useCases] = await Promise.all([
    getDictionary(locale as Locale),
    getUseCases(locale),
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'Use Cases', url: `/${locale}/use-cases` },
      ])} />
      <UseCasesShowcase
        locale={locale}
        dict={dict}
        useCases={useCases}
        headingLevel="h1"
      />
    </>
  )
}
