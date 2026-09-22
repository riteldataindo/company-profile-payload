import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { DeploymentView } from '@/components/smartcounter/ResourceViews'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  return <DeploymentView locale={locale} />
}
