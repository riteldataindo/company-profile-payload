import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { getHomeCopy } from '@/lib/i18n/home-copy'
import { buildMetadata } from '@/lib/seo/metadata'
import { organizationSchema, websiteSchema, softwareApplicationSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { Hero } from '@/components/sections/Hero'
import { HomeHowItWorks } from '@/components/sections/home/HomeHowItWorks'
import { HomeGateway } from '@/components/sections/home/HomeGateway'
import { HomeDecisionGroups } from '@/components/sections/home/HomeDecisionGroups'
import { HomeEvidence } from '@/components/sections/home/HomeEvidence'
import { HomeDemo } from '@/components/sections/home/HomeDemo'
import { HomeFaqFooterTransition } from '@/components/sections/home/HomeFaqFooterTransition'
import { getClientLogos, getSiteSettings } from '@/lib/data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const copy = getHomeCopy(locale)
  return buildMetadata({
    title: locale === 'id'
      ? 'People Counting & Visitor Analytics untuk Retail dan Mall'
      : 'People Counting & Visitor Analytics for Retail and Mall',
    description: copy.hero.description,
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

  const [siteSettings, clientLogos] = await Promise.all([
    getSiteSettings(locale),
    getClientLogos(),
  ])
  const copy = getHomeCopy(locale)

  return (
    <>
      <JsonLd data={organizationSchema(siteSettings)} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={softwareApplicationSchema()} />
      <Hero locale={locale} copy={copy.hero} />
      <HomeHowItWorks locale={locale} copy={copy.howItWorks} />
      <HomeGateway locale={locale} copy={copy.gateway} />
      <HomeDecisionGroups locale={locale} copy={copy.decisions} />
      <HomeEvidence clientLogos={clientLogos} locale={locale} copy={copy.evidence} />
      <HomeDemo locale={locale} copy={copy.demo} />
      <HomeFaqFooterTransition locale={locale} copy={copy.faq} />
    </>
  )
}
