import type { SiteSetting } from '@/payload-types'
import { getMediaUrl } from '@/lib/data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcounter.id'
const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

function absoluteUrl(value: string): string {
  return new URL(value, SITE_URL).toString()
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
  const logo = getMediaUrl(settings?.logo)
  const email = settings?.contactEmail || undefined
  const phone = isUsablePhone(settings?.contactPhone) ? settings.contactPhone : undefined
  const address = settings?.contactAddress?.trim() || undefined
  const sameAs = socialProfiles(settings)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: settings?.siteName || 'SmartCounter',
    legalName: 'PT Ritel Data Indonesia',
    url: SITE_URL,
    description: settings?.siteDescription || 'People counting and visitor analytics for retail stores, malls, and shopping centers.',
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
    url: SITE_URL,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: ['en', 'id'],
  }
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: 'SmartCounter',
    url: SITE_URL,
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

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
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
    url: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
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
    url: `${SITE_URL}/${service.locale}/features/${service.slug}`,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
  }
}
