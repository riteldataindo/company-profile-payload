import type { SiteSetting } from '@/payload-types'
import { getMediaUrl } from '@/lib/data'
import { getSiteUrl, siteUrlForPath } from './site'

const SITE_URL = getSiteUrl()?.toString()
const ORGANIZATION_ID = `${SITE_URL || ''}/#organization`
const WEBSITE_ID = `${SITE_URL || ''}/#website`

function absoluteUrl(value: string): string {
  return SITE_URL ? new URL(value, SITE_URL).toString() : value
}

function isUsablePhone(value?: string | null): value is string {
  if (!value) return false
  const digits = value.replace(/\D/g, '')
  return digits.length >= 8 && !digits.includes('1234567890')
}

function socialProfiles(settings?: SiteSetting | null): string[] {
  if (!settings?.socialLinks) return []
  return Object.values(settings.socialLinks).filter((value): value is string => {
    if (!value) return false
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol)
    } catch {
      return false
    }
  })
}

export function organizationSchema(settings?: SiteSetting | null) {
  const identityVerified = settings?.identityVerified === true
  const logo = identityVerified ? getMediaUrl(settings?.logo) : undefined
  const email = identityVerified ? settings?.contactEmail || undefined : undefined
  const phone = identityVerified && isUsablePhone(settings?.contactPhone)
    ? settings.contactPhone
    : undefined
  const address = identityVerified ? settings?.contactAddress?.trim() || undefined : undefined
  const sameAs = identityVerified ? socialProfiles(settings) : []

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: settings?.siteName || 'SmartCounter',
    ...(settings?.siteDescription && { description: settings.siteDescription }),
    ...(SITE_URL && { url: SITE_URL }),
    ...(logo && { logo: { '@type': 'ImageObject', url: absoluteUrl(logo) } }),
    ...((email || phone) && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...(email && { email }),
        ...(phone && { telephone: phone }),
        contactType: 'sales',
        availableLanguage: ['English', 'Indonesian'],
      },
    }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressCountry: 'ID',
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'SmartCounter',
    ...(SITE_URL && { url: SITE_URL }),
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: ['en', 'id'],
  }
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL || ''}/#software`,
    name: 'SmartCounter',
    ...(SITE_URL && { url: SITE_URL }),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'People counting and visitor analytics software for retail stores, malls, and shopping centers.',
    provider: { '@id': ORGANIZATION_ID },
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}

export function blogPostingSchema(post: {
  title: string
  excerpt: string
  slug: string
  locale: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: siteUrlForPath(`/${post.locale}/blog/${post.slug}`) || `/${post.locale}/blog/${post.slug}`,
    mainEntityOfPage: siteUrlForPath(`/${post.locale}/blog/${post.slug}`) || `/${post.locale}/blog/${post.slug}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    ...(post.image && {
      image: { '@type': 'ImageObject', url: absoluteUrl(post.image) },
    }),
    inLanguage: post.locale,
  }
}

export function authorSchema(author: {
  name: string
  url?: string
  jobTitle?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle || 'Product & Analytics Team',
    worksFor: { '@id': ORGANIZATION_ID },
    ...(author.url && { url: absoluteUrl(author.url) }),
  }
}

export function serviceSchema(service: {
  name: string
  description: string
  slug: string
  locale: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: siteUrlForPath(`/${service.locale}/features/${service.slug}`) || `/${service.locale}/features/${service.slug}`,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
  }
}
