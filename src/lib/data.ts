import { getPayload } from './payload'
import { locales, type Locale } from '@/lib/i18n/config'
import { sanitizePublicContent } from '@/lib/claims'
import type { LocalizedSlugs } from '@/lib/localized-routes'

// Helper to get default locale if not provided
const DEFAULT_LOCALE: Locale = 'en'

function normalizeLocale(locale: string): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE
}

type LocalizedPublicCollection = 'features' | 'use-cases' | 'blog-posts'

export type LocalizedRouteResolution = {
  document: any
  id: number | string
  slugs: LocalizedSlugs
  sourceLocale: Locale
}

function publicDocumentWhere(collection: LocalizedPublicCollection, slug: string) {
  const publicationGuard = collection === 'blog-posts'
    ? { status: { equals: 'published' } }
    : { isVisible: { equals: true } }

  return {
    and: [
      { slug: { equals: slug } },
      publicationGuard,
    ],
  }
}

function isPublicDocument(collection: LocalizedPublicCollection, document: any) {
  return collection === 'blog-posts'
    ? document?.status === 'published'
    : document?.isVisible === true
}

async function resolveLocalizedPublicRoute(
  collection: LocalizedPublicCollection,
  slug: string,
  requestedLocale: Locale,
  depth: number,
): Promise<LocalizedRouteResolution | null> {
  const payload = await getPayload()
  let sourceDocument: any = null
  let sourceLocale: Locale = requestedLocale

  for (const locale of [requestedLocale, ...locales.filter(item => item !== requestedLocale)]) {
    const result = await payload.find({
      collection,
      where: publicDocumentWhere(collection, slug),
      locale,
      fallbackLocale: false,
      limit: 1,
      depth: 0,
    } as any)

    if (result.docs?.[0]) {
      sourceDocument = result.docs[0]
      sourceLocale = locale
      break
    }
  }

  if (!sourceDocument) return null

  const localizedEntries = await Promise.all(locales.map(async (locale) => {
    const document = await payload.findByID({
      collection,
      id: sourceDocument.id,
      locale,
      fallbackLocale: false,
      depth,
      disableErrors: true,
    } as any)

    return [locale, document] as const
  }))

  const localizedDocuments = Object.fromEntries(localizedEntries) as Partial<Record<Locale, any>>
  const slugs: LocalizedSlugs = {}
  for (const locale of locales) {
    const localizedSlug = localizedDocuments[locale]?.slug
    if (typeof localizedSlug === 'string' && localizedSlug.length > 0) {
      slugs[locale] = localizedSlug
    }
  }

  const requestedDocument = localizedDocuments[requestedLocale]
  const document = isPublicDocument(collection, requestedDocument)
    ? requestedDocument
    : sourceDocument

  return {
    document: sanitizePublicContent(document),
    id: sourceDocument.id,
    slugs,
    sourceLocale,
  }
}

export function resolveFeatureRoute(slug: string, locale: string) {
  return resolveLocalizedPublicRoute('features', slug, normalizeLocale(locale), 1)
}

export function resolveUseCaseRoute(slug: string, locale: string) {
  return resolveLocalizedPublicRoute('use-cases', slug, normalizeLocale(locale), 2)
}

export function resolveBlogPostRoute(slug: string, locale: string) {
  return resolveLocalizedPublicRoute('blog-posts', slug, normalizeLocale(locale), 2)
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
  const {
    page = 1,
    limit = 10,
    category,
    locale = DEFAULT_LOCALE,
    status = 'published',
  } = options

  if (!Number.isSafeInteger(page) || page < 1) {
    throw new RangeError('Blog page must be a positive integer')
  }
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new RangeError('Blog limit must be an integer between 1 and 100')
  }

  const payload = await getPayload()
  const normalizedLocale = normalizeLocale(locale)
  const where: Record<string, any> = {
    status: { equals: status },
  }

  if (category) {
    const categoryResult = await payload.find({
      collection: 'blog-categories',
      where: { slug: { equals: category } },
      locale: normalizedLocale,
      limit: 1,
      depth: 0,
    })
    const categoryDocument = categoryResult.docs?.[0]

    if (!categoryDocument) {
      return {
        docs: [],
        totalDocs: 0,
        totalPages: 0,
        page,
        hasNextPage: false,
        hasPrevPage: page > 1,
        categoryFound: false,
      }
    }

    where.category = { equals: categoryDocument.id }
  }

  const result = await payload.find({
    collection: 'blog-posts',
    where,
    locale: normalizedLocale,
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
    categoryFound: true,
  }
}

export async function getBlogCategory(slug: string, locale: string = DEFAULT_LOCALE) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'blog-categories',
    where: { slug: { equals: slug } },
    locale: normalizeLocale(locale),
    limit: 1,
    depth: 0,
  })

  return sanitizePublicContent(result.docs?.[0] || null)
}

export async function findBlogCategory(
  value: string,
  locale: string = DEFAULT_LOCALE,
) {
  const categories = await getBlogCategories(locale)
  const normalizedValue = value.trim().toLocaleLowerCase()
  return categories.find((category: any) => (
    category.slug?.toLocaleLowerCase() === normalizedValue
    || category.name?.toLocaleLowerCase() === normalizedValue
  )) || null
}

// Blog Categories
export async function getBlogCategories(locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-categories',
      locale: normalizeLocale(locale),
      sort: 'name',
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
