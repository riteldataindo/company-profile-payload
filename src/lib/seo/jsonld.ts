const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcounter.id'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SmartCounter',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: "Indonesia's #1 AI-powered people counting and visitor analytics platform.",
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@riteldata.id',
      telephone: '+62-882-1001-9165',
      contactType: 'sales',
      availableLanguage: ['English', 'Indonesian'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sunter Agung',
      addressLocality: 'Jakarta Utara',
      addressCountry: 'ID',
    },
    sameAs: [
      'https://www.linkedin.com/company/smartcounter',
      'https://www.instagram.com/smartcounter.id',
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SmartCounter',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/en/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SmartCounter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered people counting and visitor analytics platform for retail stores, malls, and shopping centers.',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price: '0',
      description: 'Contact for pricing',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '300',
    },
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
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
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SmartCounter',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    ...(post.image && {
      image: { '@type': 'ImageObject', url: post.image },
    }),
    inLanguage: post.locale,
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
    provider: {
      '@type': 'Organization',
      name: 'SmartCounter',
    },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
  }
}
