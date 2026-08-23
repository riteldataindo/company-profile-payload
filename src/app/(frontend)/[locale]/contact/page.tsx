import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSiteSettings } from '@/lib/data'
import { ContactClient } from '@/components/contact/ContactClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: locale === 'id' ? 'Hubungi SmartCounter' : 'Contact SmartCounter',
    description: locale === 'id'
      ? 'Hubungi SmartCounter untuk visitor analytics, kecocokan lokasi, dan pertanyaan deployment.'
      : 'Contact SmartCounter about visitor analytics, site fit, and deployment questions.',
    locale,
    path: '/contact',
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const siteSettings = await getSiteSettings(locale)

  const contactInfo = {
    identityVerified: (siteSettings as any)?.identityVerified === true,
    email: typeof siteSettings?.contactEmail === 'string' ? siteSettings.contactEmail : undefined,
    phone: typeof siteSettings?.contactPhone === 'string' ? siteSettings.contactPhone : undefined,
    whatsapp: typeof siteSettings?.whatsappNumber === 'string' ? siteSettings.whatsappNumber : undefined,
    address: typeof siteSettings?.contactAddress === 'string' ? siteSettings.contactAddress : undefined,
    socialLinks: Object.fromEntries(
      Object.entries(siteSettings?.socialLinks || {}).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0,
      ),
    ),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'Contact', url: `/${locale}/contact` },
      ])} />
      <ContactClient locale={locale} contactInfo={contactInfo} />
    </>
  )
}
