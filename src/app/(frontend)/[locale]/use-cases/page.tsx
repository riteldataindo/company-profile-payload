import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { UseCasesShowcase } from '@/components/sections/UseCasesShowcase'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: locale === 'id' ? 'Solusi Retail dan Mall' : 'Retail and Mall solutions',
    description: locale === 'id'
      ? 'Pilih konteks Retail atau Mall untuk meninjau definisi metrik, prasyarat deployment, batasan, dan alur keputusan yang relevan.'
      : 'Choose a Retail or Mall context to review metric definitions, deployment prerequisites, limitations, and the relevant decision workflow.',
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

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'Use Cases', url: `/${locale}/use-cases` },
      ])} />
      <UseCasesShowcase
        locale={locale}
        headingLevel="h1"
      />
    </>
  )
}
