import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { TrustEditorialPage } from '@/components/trust/TrustEditorialPage'
import { ScopeCompareTable } from '@/components/trust/ScopeCompareTable'
import { isValidLocale } from '@/lib/i18n/config'
import { getDeploymentCopy } from '@/lib/i18n/trust-copy'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const copy = getDeploymentCopy(locale)

  return buildMetadata({
    title: `${copy.breadcrumb} — SmartCounter`,
    description: copy.intro,
    locale,
    path: '/deployment',
  })
}

export default async function DeploymentPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const copy = getDeploymentCopy(locale)

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: copy.breadcrumb, url: `/${locale}/deployment` },
      ])} />
      <TrustEditorialPage locale={locale} copy={copy} />
      <ScopeCompareTable locale={locale} />
    </>
  )
}

