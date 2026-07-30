import { getPayload } from './payload'
import { locales, type Locale } from '@/lib/i18n/config'
import { sanitizePublicContent } from '@/lib/claims'

// Helper to get default locale if not provided
const DEFAULT_LOCALE: Locale = 'en'

function normalizeLocale(locale: string): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE
}

export function getMediaUrl(media: unknown): string | undefined {
  if (!media || typeof media !== 'object' || !('url' in media)) return undefined
  return typeof media.url === 'string' && media.url.length > 0 ? media.url : undefined
}

// Features
export async function getFeatures(locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'features',
      locale: normalizeLocale(locale),
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
    })
    return sanitizePublicContent(result.docs || [])
  } catch (error) {
    console.error('Error fetching features:', error)
    return []
  }
}

export async function getFeature(slug: string, locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'features',
      where: {
        and: [
          { slug: { equals: slug } },
          { isVisible: { equals: true } },
        ],
      },
      locale: normalizeLocale(locale),
    })
    return sanitizePublicContent(result.docs?.[0] || null)
  } catch (error) {
    console.error(`Error fetching feature ${slug}:`, error)
    return null
  }
}

// Use Cases
export async function getUseCases(locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'use-cases',
      locale: normalizeLocale(locale),
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
      depth: 1, // Populate relatedFeatures
    })
    return sanitizePublicContent(result.docs || [])
  } catch (error) {
    console.error('Error fetching use cases:', error)
    return []
  }
}

export async function getUseCase(slug: string, locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'use-cases',
      where: {
        and: [
          { slug: { equals: slug } },
          { isVisible: { equals: true } },
        ],
      },
      locale: normalizeLocale(locale),
      depth: 1, // Populate relatedFeatures
    })
    return sanitizePublicContent(result.docs?.[0] || null)
  } catch (error) {
    console.error(`Error fetching use case ${slug}:`, error)
    return null
  }
}

// FAQ Items
export async function getFaqItems(locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'faq-items',
      locale: normalizeLocale(locale),
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
    })
    return sanitizePublicContent(result.docs || [])
  } catch (error) {
    console.error('Error fetching FAQ items:', error)
    return []
  }
}

// Pricing Tiers
export async function getPricingTiers(locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'pricing-tiers',
      locale: normalizeLocale(locale),
      sort: 'sortOrder',
      limit: 100,
    })
    return sanitizePublicContent(result.docs || [])
  } catch (error) {
    console.error('Error fetching pricing tiers:', error)
    return []
  }
}

// Blog Posts
export interface BlogPostQueryOptions {
  page?: number
  limit?: number
  category?: string
  locale?: string
  status?: 'published' | 'draft'
}

export async function getBlogPosts(options: BlogPostQueryOptions = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      locale = DEFAULT_LOCALE,
      status = 'published',
    } = options

    const payload = await getPayload()

    const where: Record<string, any> = {
      status: { equals: status },
    }

    if (category) {
      where.category = { slug: { equals: category } }
    }

    const result = await payload.find({
      collection: 'blog-posts',
      where,
      locale: normalizeLocale(locale),
      sort: '-publishedAt',
      limit,
      page,
      depth: 2, // Populate category and author
    })

    return {
      docs: sanitizePublicContent(result.docs || []),
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return {
      docs: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
    }
  }
}

export async function getBlogPost(slug: string, locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: 'published' } },
        ],
      },
      locale: normalizeLocale(locale),
      depth: 2, // Populate category and author
    })
    return sanitizePublicContent(result.docs?.[0] || null)
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error)
    return null
  }
}

/**
 * Resolve a published article by a slug from any locale, then return that same
 * document in the requested locale. This keeps old/shared links working if
 * localized slugs are introduced later.
 */
export async function findBlogPostByAnySlug(slug: string, locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()

    for (const sourceLocale of locales) {
      const match = await payload.find({
        collection: 'blog-posts',
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: 'published' } },
          ],
        },
        locale: sourceLocale,
        limit: 1,
        depth: 0,
      })

      const source = match.docs?.[0]
      if (!source) continue

      const localized = await payload.findByID({
        collection: 'blog-posts',
        id: source.id,
        locale: normalizeLocale(locale),
        depth: 2,
      })

      return localized?.status === 'published' ? sanitizePublicContent(localized) : null
    }

    return null
  } catch (error) {
    console.error(`Error resolving blog post ${slug} across locales:`, error)
    return null
  }
}

// Blog Categories
export async function getBlogCategories(locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-categories',
      locale: normalizeLocale(locale),
      limit: 100,
    })
    return sanitizePublicContent(result.docs || [])
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return []
  }
}

// Deployment Locations
export async function getDeploymentLocations() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'deployment-locations',
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
    })
    return sanitizePublicContent(result.docs || [])
  } catch (error) {
    console.error('Error fetching deployment locations:', error)
    return []
  }
}

// Client Logos
export async function getClientLogos() {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'client-logos',
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
      depth: 1,
    })
    return sanitizePublicContent(result.docs || [])
  } catch (error) {
    console.error('Error fetching client logos:', error)
    return []
  }
}

// Site Settings Global
export async function getSiteSettings(locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.findGlobal({
      slug: 'site-settings',
      locale: normalizeLocale(locale),
      depth: 1, // Populate media
    })
    return sanitizePublicContent(result || null)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}
