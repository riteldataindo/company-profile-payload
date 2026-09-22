import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { DemoView } from '@/components/smartcounter/DemoView'
import { readContactQuery } from '@/lib/profile/form-query'

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
  return <DemoView locale={locale} solution={solution} />
}
