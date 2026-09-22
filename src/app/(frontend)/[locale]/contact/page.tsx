import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { ContactView } from '@/components/smartcounter/CompanyViews'
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
  const search = new URLSearchParams()
  const solution = typeof query.solution === 'string' ? query.solution : ''
  const packageName = typeof query.package === 'string' ? query.package : ''
  if (solution) search.set('solution', solution)
  if (packageName) search.set('package', packageName)
  const parsed = readContactQuery(search.toString())
  return <ContactView locale={locale} solution={parsed.solution} packageName={parsed.packageName} />
}
