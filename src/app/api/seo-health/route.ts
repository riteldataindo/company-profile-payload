import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { authorizeAdminRequest, privateAdminHeaders } from '@/lib/admin-auth'

interface CacheEntry {
  data: SeoHealthResponse
  timestamp: number
}

interface SeoHealthResponse {
  items: Array<{
    label: string
    value: string | number
    status: 'green' | 'amber' | 'red'
    detail: string
  }>
  lastUpdated: string
}

// Simple in-memory cache with 10-minute TTL
const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

async function getCachedOrCompute(): Promise<SeoHealthResponse> {
  const cacheKey = 'seo-health'
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const payload = await getPayload({ config: configPromise })

  // Fetch collections
  const [blogPosts, features, useCases] = await Promise.all([
    payload.find({ collection: 'blog-posts', limit: 1000 }),
    payload.find({ collection: 'features', limit: 1000 }),
    payload.find({ collection: 'use-cases', limit: 1000 }),
  ])

  const items: SeoHealthResponse['items'] = []

  // 1. Missing meta descriptions
  const missingDescriptions = {
    blogPosts: (blogPosts.docs || []).filter(
      doc => !doc.meta?.description || doc.meta.description.trim() === ''
    ),
    features: (features.docs || []).filter(
      doc => !doc.meta?.description || doc.meta.description.trim() === ''
    ),
    useCases: (useCases.docs || []).filter(
      doc => !doc.meta?.description || doc.meta.description.trim() === ''
    ),
  }

  const totalMissingDescriptions =
    missingDescriptions.blogPosts.length +
    missingDescriptions.features.length +
    missingDescriptions.useCases.length

  const missingDescriptionsList = [
    ...missingDescriptions.blogPosts.map(doc => `Blog: ${doc.title}`),
    ...missingDescriptions.features.map(doc => `Feature: ${doc.name}`),
    ...missingDescriptions.useCases.map(doc => `Use Case: ${doc.industryName}`),
  ].slice(0, 5)

  items.push({
    label: 'Missing Meta Descriptions',
    value: totalMissingDescriptions,
    status: totalMissingDescriptions === 0 ? 'green' : 'amber',
    detail:
      totalMissingDescriptions === 0
        ? 'All pages have meta descriptions'
        : `${totalMissingDescriptions} pages missing. ${missingDescriptionsList.join(', ')}${missingDescriptionsList.length < totalMissingDescriptions ? '...' : ''}`,
  })

  // 2. Missing OG images
  const missingImages = {
    blogPosts: (blogPosts.docs || []).filter(
      doc => !doc.meta?.image || (typeof doc.meta.image === 'object' && !doc.meta.image.id)
    ),
    features: (features.docs || []).filter(
      doc => !doc.meta?.image || (typeof doc.meta.image === 'object' && !doc.meta.image.id)
    ),
    useCases: (useCases.docs || []).filter(
      doc => !doc.meta?.image || (typeof doc.meta.image === 'object' && !doc.meta.image.id)
    ),
  }

  const totalMissingImages =
    missingImages.blogPosts.length + missingImages.features.length + missingImages.useCases.length

  const missingImagesList = [
    ...missingImages.blogPosts.map(doc => `Blog: ${doc.title}`),
    ...missingImages.features.map(doc => `Feature: ${doc.name}`),
    ...missingImages.useCases.map(doc => `Use Case: ${doc.industryName}`),
  ].slice(0, 5)

  items.push({
    label: 'Missing OG Images',
    value: totalMissingImages,
    status: totalMissingImages === 0 ? 'green' : 'amber',
    detail:
      totalMissingImages === 0
        ? 'All pages have OG images'
        : `${totalMissingImages} pages missing. ${missingImagesList.join(', ')}${missingImagesList.length < totalMissingImages ? '...' : ''}`,
  })

  // 3. Sitemap status
  let sitemapStatus = 'Missing'
  let urlCount = 0

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const sitemapUrl = `${siteUrl}/sitemap.xml`

    const response = await fetch(sitemapUrl, { method: 'HEAD' })
    if (response.ok) {
      sitemapStatus = 'Generated'
      // Try to count URLs by fetching the full sitemap
      try {
        const xmlResponse = await fetch(sitemapUrl)
        const xmlText = await xmlResponse.text()
        const urlMatches = xmlText.match(/<url>/g)
        if (urlMatches) {
          urlCount = urlMatches.length
        }
      } catch {
        // Could not parse sitemap, but it exists
      }
    }
  } catch {
    // Fetch failed, sitemap not accessible
  }

  items.push({
    label: 'Sitemap Status',
    value: sitemapStatus,
    status: sitemapStatus === 'Generated' ? 'green' : 'red',
    detail: sitemapStatus === 'Generated' ? `Generated with ${urlCount} URLs` : 'Sitemap not found at /sitemap.xml',
  })

  // 4. Structured data (JSON-LD)
  let structuredDataStatus = 'Not checked'
  let validCount = 0
  let errorCount = 0

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const homepageUrl = `${siteUrl}/en`

    const response = await fetch(homepageUrl)
    if (response.ok) {
      const html = await response.text()
      const jsonLdPattern = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g
      const matches = Array.from(html.matchAll(jsonLdPattern))

      if (matches.length > 0) {
        for (const match of matches) {
          try {
            JSON.parse(match[1])
            validCount++
          } catch {
            errorCount++
          }
        }
        structuredDataStatus = errorCount === 0
          ? `Valid (${validCount} found)`
          : `${errorCount} invalid, ${validCount} valid`
      } else {
        errorCount = 1
        structuredDataStatus = 'Not found'
      }
    }
  } catch {
    errorCount = 1
    structuredDataStatus = 'Error checking'
  }

  items.push({
    label: 'Structured Data (JSON-LD)',
    value: structuredDataStatus,
    status: validCount > 0 && errorCount === 0 ? 'green' : 'red',
    detail: errorCount > 0
      ? `${errorCount} invalid JSON-LD block(s); ${validCount} valid`
      : `Parsed ${validCount} valid JSON-LD schema(s)`,
  })

  // 5. Broken internal links
  items.push({
    label: 'Broken Internal Links',
    value: 'Not scanned',
    status: 'amber',
    detail: 'Skipped (expensive computation). Run crawler tool for full audit.',
  })

  // 6. Total pages
  const totalPages =
    (blogPosts.docs?.length || 0) +
    (features.docs?.length || 0) +
    (useCases.docs?.length || 0) +
    8 // homepage, features, use cases, packages, FAQ, blog, contact, demo

  items.push({
    label: 'Total Public Pages',
    value: totalPages,
    status: 'green',
    detail: `${blogPosts.docs?.length || 0} blog posts, ${features.docs?.length || 0} features, ${useCases.docs?.length || 0} use cases, + 8 static pages`,
  })

  // 7. Core Web Vitals
  items.push({
    label: 'Core Web Vitals',
    value: 'Not measured',
    status: 'amber',
    detail: 'Requires real user data. Use Google Analytics or PageSpeed Insights.',
  })

  // 8. Mobile usability
  items.push({
    label: 'Mobile Usability',
    value: 'Not measured',
    status: 'amber',
    detail: 'Use Google Mobile-Friendly Test for detailed analysis.',
  })

  const response: SeoHealthResponse = {
    items,
    lastUpdated: new Date().toISOString(),
  }

  // Store in cache
  cache.set(cacheKey, {
    data: response,
    timestamp: Date.now(),
  })

  return response
}

export async function GET(request: Request) {
  try {
    const authorization = await authorizeAdminRequest(request, 'read')
    if (!authorization.ok) return authorization.response

    const url = new URL(request.url)
    if (url.searchParams.get('refresh') === 'true') {
      cache.delete('seo-health')
    }
    const data = await getCachedOrCompute()
    return Response.json(data, { headers: privateAdminHeaders() })
  } catch (error) {
    console.error('SEO Health Error:', error)
    return Response.json(
      {
        error: 'Failed to compute SEO health',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
