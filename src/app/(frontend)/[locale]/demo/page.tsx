import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { DemoView } from '@/components/smartcounter/DemoView'
import { ProductScreens } from '@/components/smartcounter/landing/ProductScreens'
import { getCompanyContact } from '@/lib/profile/contact-server'
import { readContactQuery } from '@/lib/profile/form-query'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: locale === 'id' ? 'Jadwalkan demo SmartCounter' : 'Book a SmartCounter demo',
    description: locale === 'id'
      ? 'Tim kami menunjukkan dashboard untuk toko atau mall, dan membahas apa yang bisa kami hitung di lokasi Anda.'
      : 'Our team walks you through the dashboard for stores or malls, and talks through what we would count at your site.',
    locale,
    path: '/demo',
  })
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const query = await searchParams
  if (!isValidLocale(locale)) notFound()
  const requested = typeof query.solution === 'string' ? query.solution : ''
  const parsed = readContactQuery(requested ? `solution=${requested}` : '')
  const solution = parsed.solution === 'shared' ? 'retail' : parsed.solution
  const contact = await getCompanyContact(locale)
  return (
    <>
      <DemoView locale={locale} solution={solution} contact={contact} />
      <ProductScreens locale={locale} />
    </>
  )
}
