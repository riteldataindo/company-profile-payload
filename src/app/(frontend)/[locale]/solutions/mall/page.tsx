import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { SolutionPage } from '@/components/solutions/SolutionPage'
import { getSolutionCopy } from '@/lib/i18n/solution-copy'
import { isValidLocale } from '@/lib/i18n/config'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const copy = getSolutionCopy(locale, 'mall')
  return buildMetadata({
    title: `${copy.eyebrow} — SmartCounter`,
    description: copy.lead,
    locale,
    path: '/solutions/mall',
  })
}

export default async function MallSolutionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'Mall', url: `/${locale}/solutions/mall` },
      ])} />
      <SolutionPage locale={locale} kind="mall" />
    </>
  )
}
