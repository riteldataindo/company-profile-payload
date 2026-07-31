import type { MetadataRoute } from 'next'
import { getFeatures, getUseCases, getBlogPosts } from '@/lib/data'
import { indexableLocales, type IndexableLocale } from '@/lib/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcounter.id'

const staticPaths = [
  '',
  '/features',
  '/use-cases',
  '/packages',
  '/faq',
  '/blog',
  '/contact',
  '/demo',
] as const

type SitemapDocument = {
  id: number | string
  slug: string
  updatedAt?: string | null
}

function absoluteUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${path}`
}

function localizedAlternates(pathByLocale: Partial<Record<IndexableLocale, string>>) {
  const languages = Object.fromEntries(
    indexableLocales
      .filter((locale) => pathByLocale[locale] !== undefined)
      .map((locale) => [locale, absoluteUrl(locale, pathByLocale[locale] || '')]),
  )

  const defaultPath = pathByLocale.en
  if (defaultPath !== undefined) {
    languages['x-default'] = absoluteUrl('en', defaultPath)
  }

  return Object.keys(languages).length > 0 ? { languages } : undefined
}

function newestValidDate(value?: string | null): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function addLocalizedDocuments(
  entries: MetadataRoute.Sitemap,
  documentsByLocale: Record<IndexableLocale, SitemapDocument[]>,
  section: 'features' | 'use-cases' | 'blog',
) {
  const records = new Map<string, Partial<Record<IndexableLocale, SitemapDocument>>>()

  for (const locale of indexableLocales) {
    for (const document of documentsByLocale[locale]) {
      if (!document.slug) continue
      const key = String(document.id)
      records.set(key, { ...records.get(key), [locale]: document })
    }
  }

  for (const localized of records.values()) {
    const pathByLocale: Partial<Record<IndexableLocale, string>> = {}
    for (const locale of indexableLocales) {
      const document = localized[locale]
      if (document) pathByLocale[locale] = `/${section}/${document.slug}`
    }

    const alternates = localizedAlternates(pathByLocale)
    for (const locale of indexableLocales) {
      const document = localized[locale]
      const path = pathByLocale[locale]
      if (!document || !path) continue

      entries.push({
        url: absoluteUrl(locale, path),
        ...(newestValidDate(document.updatedAt) && {
          lastModified: newestValidDate(document.updatedAt),
        }),
        ...(alternates && { alternates }),
      })
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const path of staticPaths) {
    const pathByLocale = Object.fromEntries(
      indexableLocales.map((locale) => [locale, path]),
    ) as Record<IndexableLocale, string>
    const alternates = localizedAlternates(pathByLocale)

    for (const locale of indexableLocales) {
      entries.push({
        url: absoluteUrl(locale, path),
        ...(alternates && { alternates }),
      })
    }
  }

  const localeContent = await Promise.all(
    indexableLocales.map(async (locale) => {
      const [features, useCases, blog] = await Promise.all([
        getFeatures(locale),
        getUseCases(locale),
        getBlogPosts({ locale, limit: 100 }),
      ])
      return { locale, features, useCases, blog: blog.docs }
    }),
  )

  const featuresByLocale = { en: [], id: [] } as Record<IndexableLocale, SitemapDocument[]>
  const useCasesByLocale = { en: [], id: [] } as Record<IndexableLocale, SitemapDocument[]>
  const blogByLocale = { en: [], id: [] } as Record<IndexableLocale, SitemapDocument[]>

  for (const content of localeContent) {
    featuresByLocale[content.locale] = content.features as SitemapDocument[]
    useCasesByLocale[content.locale] = content.useCases as SitemapDocument[]
    blogByLocale[content.locale] = content.blog as SitemapDocument[]
  }

  addLocalizedDocuments(entries, featuresByLocale, 'features')
  addLocalizedDocuments(entries, useCasesByLocale, 'use-cases')
  addLocalizedDocuments(entries, blogByLocale, 'blog')

  return entries
}
