import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { organizationSchema, websiteSchema, softwareApplicationSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSiteSettings } from '@/lib/data'
import { getCompanyContact } from '@/lib/profile/contact-server'
import { HomeView } from '@/components/smartcounter/HomeView'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: locale === 'id'
      ? 'People Counting & Visitor Analytics untuk Retail dan Mall'
      : 'People Counting & Visitor Analytics for Retail and Mall',
    description: locale === 'id'
      ? 'SmartCounter menghitung orang yang masuk ke toko dan mall Anda, lalu menunjukkan jam tersibuk, entrance paling ramai, dan perbandingan tiap lokasi.'
      : 'SmartCounter counts the people entering your stores and malls, and shows when traffic peaks, which entrances bring people in, and how each location compares.',
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
  const [siteSettings, contact] = await Promise.all([
    getSiteSettings(locale),
    getCompanyContact(locale),
  ])
  return (
    <>
      <JsonLd data={organizationSchema(siteSettings)} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={softwareApplicationSchema()} />
      <HomeView locale={locale} contact={contact} />
    </>
  )
}
