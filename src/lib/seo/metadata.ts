import type { Metadata } from 'next'
import {
  defaultLocale,
  indexableLocales,
  isIndexableLocale,
  type IndexableLocale,
} from '@/lib/i18n/config'
import { getMediaUrl, getSiteSettings } from '@/lib/data'

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

export async function buildMetadata({
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
}: MetadataOptions): Promise<Metadata> {
  const settings = await getSiteSettings(locale)
  const resolvedOgImage = ogImage || getMediaUrl(settings?.defaultOgImage)
  const siteName = settings?.siteName || SITE_NAME
  const canonicalPath = path === '' ? `/${locale}` : `/${locale}${path}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  const languages: Record<string, string> = {}
  for (const loc of indexableLocales) {
    const localizedPath = alternatePaths ? alternatePaths[loc] : path
    if (localizedPath === undefined) continue
    const locPath = localizedPath === '' ? `/${loc}` : `/${loc}${localizedPath}`
    languages[loc] = `${SITE_URL}${locPath}`
  }
  const defaultPath = alternatePaths ? alternatePaths.en : path
  if (defaultPath !== undefined) {
    languages['x-default'] = `${SITE_URL}/${defaultLocale}${defaultPath}`
  }
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
      siteName,
      locale,
      type: ogType,
      ...(resolvedOgImage && {
        images: [{ url: resolvedOgImage, width: 1200, height: 630, alt: title }],
      }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(resolvedOgImage && { images: [resolvedOgImage] }),
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
