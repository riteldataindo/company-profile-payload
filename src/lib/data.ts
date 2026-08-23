import { getPayload } from './payload'
import { locales, type Locale } from '@/lib/i18n/config'
import { sanitizePublicContent } from '@/lib/claims'
import type { LocalizedSlugs } from '@/lib/localized-routes'

// Helper to get default locale if not provided
const DEFAULT_LOCALE: Locale = 'en'

function normalizeLocale(locale: string): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function hasRichText(value: unknown): boolean {
  if (hasText(value)) return true
  return Boolean(
    value
    && typeof value === 'object'
    && Array.isArray((value as { root?: { children?: unknown[] } }).root?.children)
    && (value as { root: { children: unknown[] } }).root.children.length > 0,
  )
}

function isCompleteLocalizedDocument(collection: LocalizedPublicCollection, document: any): boolean {
  if (!document) return false
  if (collection === 'features') {
    return document.publiclyApproved === true
      && hasText(document.stableId)
      && hasText(document.name)
      && hasText(document.slug)
      && hasText(document.shortDescription)
  }
  if (collection === 'use-cases') {
    return document.publiclyApproved === true
      && hasText(document.industryName)
      && hasText(document.slug)
      && hasText(document.shortDescription)
  }
  return hasText(document.title) && hasText(document.slug) && hasRichText(document.content)
}

function filterCompleteDocuments(collection: LocalizedPublicCollection, documents: any[]): any[] {
  return documents.filter((document) => isCompleteLocalizedDocument(collection, document))
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
    ? {
        and: [
          { status: { equals: 'published' } },
          { isVisible: { equals: true } },
        ],
      }
    : {
        and: [
          { isVisible: { equals: true } },
          { publiclyApproved: { equals: true } },
        ],
      }

  return {
    and: [
      { slug: { equals: slug } },
      publicationGuard,
    ],
  }
}

function isPublicDocument(collection: LocalizedPublicCollection, document: any) {
  return collection === 'blog-posts'
    ? document?.status === 'published' && document?.isVisible === true
    : document?.isVisible === true && document?.publiclyApproved === true
}

async function resolveLocalizedPublicRoute(
  collection: LocalizedPublicCollection,
  slug: string,
  requestedLocale: Locale,
  depth: number,
): Promise<LocalizedRouteResolution | null> {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection,
      where: publicDocumentWhere(collection, slug),
      locale: requestedLocale,
      fallbackLocale: false,
      limit: 1,
      depth: 0,
    } as any)
    const sourceDocument = result.docs?.[0]
    if (!isPublicDocument(collection, sourceDocument)
      || !isCompleteLocalizedDocument(collection, sourceDocument)) return null

    const localizedEntries = await Promise.all(locales.map(async (locale) => {
      try {
        const document = await payload.findByID({
          collection,
          id: sourceDocument.id,
          locale,
          fallbackLocale: false,
          depth,
          disableErrors: true,
        } as any)

        return [locale, document] as const
      } catch {
        return [locale, null] as const
      }
    }))

    const localizedDocuments = Object.fromEntries(localizedEntries) as Partial<Record<Locale, any>>
    const slugs: LocalizedSlugs = {}
    for (const locale of locales) {
      const localizedDocument = localizedDocuments[locale]
      const localizedSlug = localizedDocument?.slug
      if (
        isPublicDocument(collection, localizedDocument)
        && isCompleteLocalizedDocument(collection, localizedDocument)
        && typeof localizedSlug === 'string'
        && localizedSlug.length > 0
      ) {
        slugs[locale] = localizedSlug
      }
    }

    // A missing requested translation is a controlled 404, never an English
    // slug/content fallback on an Indonesian public route.
    if (!slugs[requestedLocale]) return null

    return {
      document: sanitizePublicContent(sourceDocument),
      id: sourceDocument.id,
      slugs,
      sourceLocale: requestedLocale,
    }
  } catch (error) {
    console.error(`Error resolving ${collection} route:`, error)
    return null
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
  const record = media as {
    permissionStatus?: unknown
    provenanceStatus?: unknown
    url?: unknown
  }
  if (
    record.permissionStatus !== 'approved'
    || record.provenanceStatus === 'unreviewed'
    || typeof record.url !== 'string'
  ) return undefined
  return record.url.length > 0 ? record.url : undefined
}

// Features
export async function getFeatures(locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'features',
      locale: normalizeLocale(locale),
      where: {
        isVisible: { equals: true },
        publiclyApproved: { equals: true },
      },
      sort: 'sortOrder',
      limit: 100,
    })
    return sanitizePublicContent(filterCompleteDocuments('features', result.docs || []))
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
      where: {
        isVisible: { equals: true },
        publiclyApproved: { equals: true },
      },
      sort: 'sortOrder',
      limit: 100,
      depth: 1, // Populate relatedFeatures
    })
    return sanitizePublicContent(filterCompleteDocuments('use-cases', result.docs || []))
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
      where: {
        isVisible: { equals: true },
        publiclyApproved: { equals: true },
      },
      sort: 'sortOrder',
      limit: 100,
    })
    return sanitizePublicContent((result.docs || []).filter((item: any) => (
      hasText(item?.question) && hasRichText(item?.answer)
    )))
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
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
    })
    return sanitizePublicContent((result.docs || []).filter((item: any) => hasText(item?.name)))
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

type BlogPostsResult = {
  docs: any[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
  categoryFound: boolean
  failed?: boolean
}

function emptyBlogResult(page: number, categoryFound: boolean, failed = false): BlogPostsResult {
  return {
    docs: [],
    totalDocs: 0,
    totalPages: 0,
    page,
    hasNextPage: false,
    hasPrevPage: page > 1,
    categoryFound,
    ...(failed && { failed: true }),
  }
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

  try {
    const payload = await getPayload()
    const normalizedLocale = normalizeLocale(locale)
    const where: Record<string, any> = {
      status: { equals: status },
      isVisible: { equals: true },
    }

    if (category) {
      const categoryResult = await payload.find({
        collection: 'blog-categories',
        where: {
          and: [
            { slug: { equals: category } },
            { isVisible: { equals: true } },
          ],
        },
        locale: normalizedLocale,
        fallbackLocale: false,
        limit: 1,
        depth: 0,
      })
      const categoryDocument = categoryResult.docs?.[0]

      if (!categoryDocument || !hasText(categoryDocument.name) || !hasText(categoryDocument.slug)) {
        return emptyBlogResult(page, false)
      }

      where.category = { equals: categoryDocument.id }
    }

    const result = await payload.find({
      collection: 'blog-posts',
      where,
      locale: normalizedLocale,
      fallbackLocale: false,
      sort: '-publishedAt',
      limit,
      page,
      depth: 2, // Populate category and author
    })

    return {
      docs: sanitizePublicContent(filterCompleteDocuments('blog-posts', result.docs || [])),
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page || page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      categoryFound: true,
    } satisfies BlogPostsResult
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return emptyBlogResult(page, Boolean(!category), true)
  }
}

export async function getBlogCategory(slug: string, locale: string = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-categories',
      where: {
        and: [
          { slug: { equals: slug } },
          { isVisible: { equals: true } },
        ],
      },
      locale: normalizeLocale(locale),
      fallbackLocale: false,
      limit: 1,
      depth: 0,
    })
    const category = result.docs?.[0]
    return category && hasText(category.name) && hasText(category.slug)
      ? sanitizePublicContent(category)
      : null
  } catch (error) {
    console.error('Error fetching blog category:', error)
    return null
  }
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
      where: { isVisible: { equals: true } },
      sort: 'name',
      limit: 100,
    })
    return sanitizePublicContent((result.docs || []).filter((item: any) => (
      hasText(item?.name) && hasText(item?.slug)
    )))
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
      where: {
        and: [
          { isVisible: { equals: true } },
          { permissionStatus: { equals: 'approved' } },
        ],
      },
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
      where: {
        and: [
          { isVisible: { equals: true } },
          { permissionStatus: { equals: 'approved' } },
          { customerStatus: { equals: 'active' } },
        ],
      },
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
