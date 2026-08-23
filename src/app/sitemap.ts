import type { MetadataRoute } from 'next'
import { indexableLocales, type IndexableLocale } from '@/lib/i18n/config'
import { getSiteUrl, siteUrlForPath } from '@/lib/seo/site'

// Packages and Blog stay out of the public index until their publication gates
// are explicitly enabled. Detail records can be added here only with a tested
// published/completeness query.
const staticPaths = [
  '',
  '/solutions/retail',
  '/solutions/mall',
  '/features',
  '/use-cases',
  '/deployment',
  '/privacy',
  '/faq',
  '/contact',
  '/demo',
] as const

function localizedAlternates(path: string) {
  const languages = Object.fromEntries(
    indexableLocales.map((locale) => [
      locale,
      siteUrlForPath(`/${locale}${path}`) || '',
    ]),
  )
  const defaultUrl = siteUrlForPath(`/en${path}`)
  if (defaultUrl) languages['x-default'] = defaultUrl
  return { languages }
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!getSiteUrl()) return []

  return staticPaths.flatMap((path) => {
    const alternates = localizedAlternates(path)
    return indexableLocales.flatMap((locale: IndexableLocale) => {
      const url = siteUrlForPath(`/${locale}${path}`)
      return url ? [{ url, alternates }] : []
    })
  })
}
