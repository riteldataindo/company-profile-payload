import { getPayload } from './payload'
import type { Payload } from 'payload'

// Helper to get default locale if not provided
const DEFAULT_LOCALE = 'en'

// Features
export async function getFeatures(locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'features',
      locale,
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
    })
    return result.docs || []
  } catch (error) {
    console.error('Error fetching features:', error)
    return []
  }
}

export async function getFeature(slug: string, locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'features',
      where: { slug: { equals: slug } },
      locale,
    })
    return result.docs?.[0] || null
  } catch (error) {
    console.error(`Error fetching feature ${slug}:`, error)
    return null
  }
}

// Use Cases
export async function getUseCases(locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'use-cases',
      locale,
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
      depth: 1, // Populate relatedFeatures
    })
    return result.docs || []
  } catch (error) {
    console.error('Error fetching use cases:', error)
    return []
  }
}

export async function getUseCase(slug: string, locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'use-cases',
      where: { slug: { equals: slug } },
      locale,
      depth: 1, // Populate relatedFeatures
    })
    return result.docs?.[0] || null
  } catch (error) {
    console.error(`Error fetching use case ${slug}:`, error)
    return null
  }
}

// FAQ Items
export async function getFaqItems(locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'faq-items',
      locale,
      where: { isVisible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
    })
    return result.docs || []
  } catch (error) {
    console.error('Error fetching FAQ items:', error)
    return []
  }
}

// Pricing Tiers
export async function getPricingTiers(locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'pricing-tiers',
      locale,
      sort: 'sortOrder',
      limit: 100,
    })
    return result.docs || []
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
      locale,
      sort: '-publishedAt',
      limit,
      page,
      depth: 2, // Populate category and author
    })

    return {
      docs: result.docs || [],
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

export async function getBlogPost(slug: string, locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      locale,
      depth: 2, // Populate category and author
    })
    return result.docs?.[0] || null
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error)
    return null
  }
}

// Blog Categories
export async function getBlogCategories(locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'blog-categories',
      locale,
      limit: 100,
    })
    return result.docs || []
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
    return result.docs || []
  } catch (error) {
    console.error('Error fetching deployment locations:', error)
    return []
  }
}

// Site Settings Global
export async function getSiteSettings(locale = DEFAULT_LOCALE) {
  try {
    const payload = await getPayload()
    const result = await payload.findGlobal({
      slug: 'site-settings',
      locale,
      depth: 1, // Populate media
    })
    return result || null
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

