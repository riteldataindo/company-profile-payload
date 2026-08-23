import type { Metadata } from 'next'
import {
  defaultLocale,
  indexableLocales,
  isIndexableLocale,
  type IndexableLocale,
} from '@/lib/i18n/config'
import { getMediaUrl, getSiteSettings } from '@/lib/data'
import { getSiteUrl, siteUrlForPath } from './site'

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
  const siteUrl = getSiteUrl()
  const canonicalUrl = siteUrlForPath(canonicalPath)

  const languages: Record<string, string> = {}
  if (siteUrl) {
    for (const loc of indexableLocales) {
      const localizedPath = alternatePaths ? alternatePaths[loc] : path
      if (localizedPath === undefined) continue
      const locPath = localizedPath === '' ? `/${loc}` : `/${loc}${localizedPath}`
      const localizedUrl = siteUrlForPath(locPath)
      if (localizedUrl) languages[loc] = localizedUrl
    }
    const defaultPath = alternatePaths ? alternatePaths.en : path
    if (defaultPath !== undefined) {
      const defaultUrl = siteUrlForPath(
        defaultPath === '' ? `/${defaultLocale}` : `/${defaultLocale}${defaultPath}`,
      )
      if (defaultUrl) languages['x-default'] = defaultUrl
    }
  }
  const shouldNoIndex = noIndex || !isIndexableLocale(locale) || !siteUrl

  return {
    title,
    description,
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
        ...(Object.keys(languages).length > 0 && { languages }),
      },
    }),
    openGraph: {
      title,
      description,
      siteName,
      locale,
      type: ogType,
      ...(canonicalUrl && { url: canonicalUrl }),
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
