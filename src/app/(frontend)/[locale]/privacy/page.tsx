import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { TrustEditorialPage } from '@/components/trust/TrustEditorialPage'
import { isValidLocale } from '@/lib/i18n/config'
import { getPrivacyCopy } from '@/lib/i18n/trust-copy'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const copy = getPrivacyCopy(locale)

  return buildMetadata({
    title: `${copy.breadcrumb} & data boundary — SmartCounter`,
    description: copy.intro,
    locale,
    path: '/privacy',
  })
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const copy = getPrivacyCopy(locale)

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: copy.breadcrumb, url: `/${locale}/privacy` },
      ])} />
      <TrustEditorialPage locale={locale} copy={copy} />
    </>
  )
}

