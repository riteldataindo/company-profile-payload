import type { Locale } from '@/lib/i18n/config'
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
    title: 'Contact Us — SmartCounter',
    description: 'Get in touch with SmartCounter. We usually respond within 24 hours.',
    locale,
    path: '/contact',
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const siteSettings = await getSiteSettings(locale)

  const contactInfo = {
    email: siteSettings?.contactEmail || 'info@riteldata.id',
    phone: siteSettings?.contactPhone || '+62 882-1001-9165',
    whatsapp: siteSettings?.whatsappNumber || '6288210019165',
    address: siteSettings?.contactAddress || 'Komplek Griya Inti Sentosa\nJl. Griya Agung No.3 Blok M\nSunter Agung, Jakarta Utara 14350',
    socialLinks: siteSettings?.socialLinks || {},
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: `/${locale}` },
        { name: 'Contact', url: `/${locale}/contact` },
      ])} />
      <ContactClient contactInfo={contactInfo} />
    </>
  )
}
