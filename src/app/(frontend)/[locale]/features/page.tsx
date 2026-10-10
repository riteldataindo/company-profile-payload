import { notFound, redirect } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  redirect(`/${locale}/capabilities`)
}
