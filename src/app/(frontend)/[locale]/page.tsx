import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { organizationSchema, websiteSchema, softwareApplicationSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'

import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { FeaturesGrid } from '@/components/sections/FeaturesGrid'
import { HeatmapBenefit } from '@/components/sections/HeatmapBenefit'
import { UseCasesShowcase } from '@/components/sections/UseCasesShowcase'
import { DeploymentMap } from '@/components/sections/DeploymentMap'
import { ClientLogos } from '@/components/sections/ClientLogos'
import { PackagesTeaser } from '@/components/sections/PackagesTeaser'
import { FaqAccordion } from '@/components/sections/FaqAccordion'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { getFeatures, getUseCases, getFaqItems, getPricingTiers, getDeploymentLocations, getHomepage } from '@/lib/data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: 'People Counting & Visitor Analytics Indonesia | SmartCounter',
    description: "Indonesia's #1 people counting and visitor analytics platform. Turn CCTV cameras into AI-powered analytics — 99.9% accuracy, real-time heatmaps, demographics, and traffic insights for retail stores, malls, and shopping centers.",
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

  const dict = await getDictionary(locale as Locale)

  const [features, useCases, faqItems, pricingTiers, deploymentLocations, homepage] = await Promise.all([
    getFeatures(locale),
    getUseCases(locale),
    getFaqItems(locale),
    getPricingTiers(locale),
    getDeploymentLocations(),
    getHomepage(locale),
  ])

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={softwareApplicationSchema()} />
      <Hero locale={locale} dict={dict} homepage={homepage} />
      <PainPoints dict={dict} />
      <section className="px-4 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <DeploymentMap
            dict={dict}
            locations={deploymentLocations.map((loc: any) => ({
              cityName: loc.cityName,
              longitude: loc.longitude,
              latitude: loc.latitude,
              isMajor: loc.isMajor,
            }))}
          />
          <ClientLogos />
        </div>
      </section>
      <FeaturesGrid locale={locale} dict={dict} features={features} />
      <HeatmapBenefit dict={dict} />
      <UseCasesShowcase locale={locale} dict={dict} useCases={useCases} />
      <PackagesTeaser locale={locale} dict={dict} pricingTiers={pricingTiers} />
      <FaqAccordion dict={dict} faqItems={faqItems} />
      <CtaBanner locale={locale} dict={dict} />
    </>
  )
}
