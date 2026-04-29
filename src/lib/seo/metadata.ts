import type { Metadata } from 'next'
import { locales, defaultLocale } from '@/lib/i18n/config'

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
}: MetadataOptions): Metadata {
  const canonicalPath = path === '' ? `/${locale}` : `/${locale}${path}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  const languages: Record<string, string> = {}
  for (const loc of locales) {
    const locPath = path === '' ? `/${loc}` : `/${loc}${path}`
    languages[loc] = `${SITE_URL}${locPath}`
  }
  languages['x-default'] = `${SITE_URL}/${defaultLocale}${path}`

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
    ...(noIndex && { robots: { index: false, follow: false } }),
  }
}
