import type { Metadata } from 'next'
import {
  defaultLocale,
  indexableLocales,
  isIndexableLocale,
  type IndexableLocale,
} from '@/lib/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcounter.id'
const SITE_NAME = 'SmartCounter'

interface MetadataOptions {
  title: string
  description: string
  locale: string
  path: string
  ogType?: 'website' | 'article'
  ogImage?: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  noIndex?: boolean
  alternatePaths?: Partial<Record<IndexableLocale, string>>
}

export function buildMetadata({
  title,
  description,
  locale,
  path,
  ogType = 'website',
  ogImage,
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
  alternatePaths,
}: MetadataOptions): Metadata {
  const canonicalPath = path === '' ? `/${locale}` : `/${locale}${path}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  const languages: Record<string, string> = {}
  for (const loc of indexableLocales) {
    const localizedPath = alternatePaths?.[loc] ?? path
    const locPath = localizedPath === '' ? `/${loc}` : `/${loc}${localizedPath}`
    languages[loc] = `${SITE_URL}${locPath}`
  }
  const defaultPath = alternatePaths?.en ?? path
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${defaultPath}`
  const shouldNoIndex = noIndex || !isIndexableLocale(locale)

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale,
      type: ogType,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    ...(shouldNoIndex && {
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    }),
  }
}
