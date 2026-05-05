import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

interface SeoItem {
  id: string
  title: string
  type: 'blog' | 'feature' | 'usecase'
  collection: string
  slug: string
  meta: {
    title: string | null
    description: string | null
    imageId: string | null
  }
  score: number
  sourceContent: string | null
}

interface SeoItemsResponse {
  items: SeoItem[]
  total: number
}

interface BulkUpdateRequest {
  action: 'auto-generate-descriptions' | 'set-default-image'
  imageId?: string
}

interface BulkUpdateResponse {
  updated: number
  errors: string[]
}

function calculateSeoScore(
  metaTitle: string | null,
  metaDescription: string | null,
  imageId: string | null
): number {
  let score = 0

  // metaTitle: max 30 points
  if (metaTitle) {
    const len = metaTitle.length
    if (len >= 30 && len <= 60) score += 30
    else if (len > 0 && len < 30) score += 15
    else if (len > 60) score += 20
  }

  // metaDescription: max 40 points
  if (metaDescription) {
    const len = metaDescription.length
    if (len >= 100 && len <= 160) score += 40
    else if (len > 0 && len < 100) score += 20
    else if (len > 160) score += 25
  }

  // ogImage: 30 points if present
  if (imageId) {
    score += 30
  }

  return score
}

function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  let truncated = text.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex > 0) {
    truncated = truncated.substring(0, lastSpaceIndex)
  }

  return truncated
}

function mapDocToSeoItem(doc: any, type: 'blog' | 'feature' | 'usecase'): SeoItem {
  let title = ''
  let slug = ''
  let sourceContent = null

  if (type === 'blog') {
    title = doc.title || ''
    slug = doc.slug || ''
    sourceContent = doc.excerpt || null
  } else if (type === 'feature') {
    title = doc.name || ''
    slug = doc.slug || ''
    sourceContent = doc.shortDescription || null
  } else {
    title = doc.industryName || ''
    slug = doc.slug || ''
    sourceContent = doc.shortDescription || null
  }

  const metaTitle = doc.meta?.title || null
  const metaDescription = doc.meta?.description || null
  const imageId = doc.meta?.image
    ? typeof doc.meta.image === 'object'
      ? doc.meta.image.id?.toString() || null
      : doc.meta.image?.toString() || null
    : null

  const collection = type === 'blog' ? 'blog-posts' : type === 'feature' ? 'features' : 'use-cases'
  return {
    id: doc.id,
    uid: `${collection}-${doc.id}`,
    title,
    type,
    collection,
    slug,
    meta: {
      title: metaTitle,
      description: metaDescription,
      imageId,
    },
    score: calculateSeoScore(metaTitle, metaDescription, imageId),
    sourceContent,
  }
}

function filterItems(items: SeoItem[], status: string, search: string): SeoItem[] {
  let filtered = items

  // Filter by status
  if (status === 'missing-meta') {
    filtered = filtered.filter(item => !item.meta.title || !item.meta.description)
  } else if (status === 'missing-image') {
    filtered = filtered.filter(item => !item.meta.imageId)
  } else if (status === 'complete') {
    filtered = filtered.filter(
      item => item.meta.title && item.meta.description && item.meta.imageId
    )
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(item => item.title.toLowerCase().includes(searchLower))
  }

  return filtered
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    const payload = await getPayload({ config: configPromise })

    // Fetch all collections
    const [blogPostsResult, featuresResult, useCasesResult] = await Promise.all([
      payload.find({ collection: 'blog-posts', limit: 1000 }),
      payload.find({ collection: 'features', limit: 1000 }),
      payload.find({ collection: 'use-cases', limit: 1000 }),
    ])

    let allItems: SeoItem[] = []

    // Map blog posts
    if (type === 'all' || type === 'blog') {
      const blogItems = (blogPostsResult.docs || []).map(doc => mapDocToSeoItem(doc, 'blog'))
      allItems.push(...blogItems)
    }

    // Map features
    if (type === 'all' || type === 'feature') {
      const featureItems = (featuresResult.docs || []).map(doc => mapDocToSeoItem(doc, 'feature'))
      allItems.push(...featureItems)
    }

    // Map use cases
    if (type === 'all' || type === 'usecase') {
      const usecaseItems = (useCasesResult.docs || []).map(doc => mapDocToSeoItem(doc, 'usecase'))
      allItems.push(...usecaseItems)
    }

    // Apply filters
    const filteredItems = filterItems(allItems, status, search)

    // Sort by score descending
    filteredItems.sort((a, b) => b.score - a.score)

    return NextResponse.json({
      items: filteredItems,
      total: filteredItems.length,
    } as SeoItemsResponse)
  } catch (error) {
    console.error('SEO Items GET Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch SEO items',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BulkUpdateRequest

    if (!body.action) {
      return NextResponse.json(
        { error: 'Missing action field' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })
    const errors: string[] = []
    let updated = 0

    if (body.action === 'auto-generate-descriptions' || body.action === 'auto-fix-all') {
      const fixTitles = body.action === 'auto-fix-all'

      // Fetch all items
      const [blogPostsResult, featuresResult, useCasesResult] = await Promise.all([
        payload.find({ collection: 'blog-posts', limit: 1000 }),
        payload.find({ collection: 'features', limit: 1000 }),
        payload.find({ collection: 'use-cases', limit: 1000 }),
      ])

      // Process blog posts
      for (const doc of blogPostsResult.docs || []) {
        const metaDesc = doc.meta?.description
        const metaTitle = doc.meta?.title
        const needsDesc = !metaDesc || (typeof metaDesc === 'string' && metaDesc.trim() === '')
        const needsTitle = fixTitles && (!metaTitle || (typeof metaTitle === 'string' && metaTitle.trim() === ''))

        if (needsDesc || needsTitle) {
          try {
            const updateData: Record<string, unknown> = { ...doc.meta }
            if (needsDesc) {
              updateData.description = doc.excerpt
                ? truncateAtWordBoundary(doc.excerpt, 155)
                : 'No description available'
            }
            if (needsTitle) {
              const t = doc.title || 'SmartCounter'
              updateData.title = t.length > 25 ? `${t.substring(0, t.lastIndexOf(' ', 25) || 25)} — People Counting & Visitor Analytics` : `${t} — People Counting & Visitor Analytics`
            }

            await payload.update({
              collection: 'blog-posts',
              id: doc.id,
              data: { meta: updateData },
            })
            updated++
          } catch (err) {
            errors.push(`Blog post ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
        }
      }

      // Process features
      for (const doc of featuresResult.docs || []) {
        const fMetaDesc = doc.meta?.description
        const fMetaTitle = doc.meta?.title
        const needsDesc = !fMetaDesc || (typeof fMetaDesc === 'string' && fMetaDesc.trim() === '')
        const needsTitle = fixTitles && (!fMetaTitle || (typeof fMetaTitle === 'string' && fMetaTitle.trim() === ''))

        if (needsDesc || needsTitle) {
          try {
            const updateData: Record<string, unknown> = { ...doc.meta }
            if (needsDesc) {
              updateData.description = doc.shortDescription
                ? truncateAtWordBoundary(doc.shortDescription, 155)
                : 'No description available'
            }
            if (needsTitle) {
              const t = doc.name || 'SmartCounter'
              updateData.title = t.length > 22 ? `${t.substring(0, t.lastIndexOf(' ', 22) || 22)} — AI People Counting & CCTV Analytics` : `${t} — AI People Counting & CCTV Analytics`
            }

            await payload.update({
              collection: 'features',
              id: doc.id,
              data: { meta: updateData },
            })
            updated++
          } catch (err) {
            errors.push(`Feature ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
        }
      }

      // Process use cases
      for (const doc of useCasesResult.docs || []) {
        const ucMetaDesc = doc.meta?.description
        const ucMetaTitle = doc.meta?.title
        const needsDesc = !ucMetaDesc || (typeof ucMetaDesc === 'string' && ucMetaDesc.trim() === '')
        const needsTitle = fixTitles && (!ucMetaTitle || (typeof ucMetaTitle === 'string' && ucMetaTitle.trim() === ''))

        if (needsDesc || needsTitle) {
          try {
            const updateData: Record<string, unknown> = { ...doc.meta }
            if (needsDesc) {
              updateData.description = doc.shortDescription
                ? truncateAtWordBoundary(doc.shortDescription, 155)
                : 'No description available'
            }
            if (needsTitle) {
              const t = doc.industryName || 'SmartCounter'
              updateData.title = t.length > 28 ? `${t.substring(0, t.lastIndexOf(' ', 28) || 28)} — CCTV AI & Visitor Analytics` : `${t} — CCTV AI & Visitor Analytics`
            }

            await payload.update({
              collection: 'use-cases',
              id: doc.id,
              data: { meta: updateData },
            })
            updated++
          } catch (err) {
            errors.push(
              `Use case ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`
            )
          }
        }
      }
    } else if (body.action === 'set-default-image') {
      if (!body.imageId) {
        return NextResponse.json(
          { error: 'Missing imageId for set-default-image action' },
          { status: 400 }
        )
      }

      // Fetch all items
      const [blogPostsResult, featuresResult, useCasesResult] = await Promise.all([
        payload.find({ collection: 'blog-posts', limit: 1000 }),
        payload.find({ collection: 'features', limit: 1000 }),
        payload.find({ collection: 'use-cases', limit: 1000 }),
      ])

      // Process blog posts
      for (const doc of blogPostsResult.docs || []) {
        const hasImage = doc.meta?.image
          ? typeof doc.meta.image === 'object'
            ? doc.meta.image.id
            : doc.meta.image
          : null

        if (!hasImage) {
          try {
            await payload.update({
              collection: 'blog-posts',
              id: doc.id,
              data: {
                meta: {
                  ...doc.meta,
                  image: parseInt(body.imageId, 10),
                },
              },
            })
            updated++
          } catch (err) {
            errors.push(`Blog post ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
        }
      }

      // Process features
      for (const doc of featuresResult.docs || []) {
        const hasImage = doc.meta?.image
          ? typeof doc.meta.image === 'object'
            ? doc.meta.image.id
            : doc.meta.image
          : null

        if (!hasImage) {
          try {
            await payload.update({
              collection: 'features',
              id: doc.id,
              data: {
                meta: {
                  ...doc.meta,
                  image: parseInt(body.imageId, 10),
                },
              },
            })
            updated++
          } catch (err) {
            errors.push(`Feature ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
        }
      }

      // Process use cases
      for (const doc of useCasesResult.docs || []) {
        const hasImage = doc.meta?.image
          ? typeof doc.meta.image === 'object'
            ? doc.meta.image.id
            : doc.meta.image
          : null

        if (!hasImage) {
          try {
            await payload.update({
              collection: 'use-cases',
              id: doc.id,
              data: {
                meta: {
                  ...doc.meta,
                  image: parseInt(body.imageId, 10),
                },
              },
            })
            updated++
          } catch (err) {
            errors.push(
              `Use case ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`
            )
          }
        }
      }
    } else if (body.action === 'use-content-images') {
      const [blogPostsResult, featuresResult, useCasesResult] = await Promise.all([
        payload.find({ collection: 'blog-posts', limit: 1000 }),
        payload.find({ collection: 'features', limit: 1000 }),
        payload.find({ collection: 'use-cases', limit: 1000 }),
      ])

      for (const doc of featuresResult.docs || []) {
        const hasOg = doc.meta?.image
          ? typeof doc.meta.image === 'object' ? doc.meta.image.id : doc.meta.image
          : null
        const contentImage = doc.image
          ? typeof doc.image === 'object' ? doc.image.id : doc.image
          : null

        if (!hasOg && contentImage) {
          try {
            await payload.update({
              collection: 'features',
              id: doc.id,
              data: { meta: { ...doc.meta, image: contentImage } },
            })
            updated++
          } catch (err) {
            errors.push(`Feature ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
        }
      }

      for (const doc of useCasesResult.docs || []) {
        const hasOg = doc.meta?.image
          ? typeof doc.meta.image === 'object' ? doc.meta.image.id : doc.meta.image
          : null
        const contentImage = doc.image
          ? typeof doc.image === 'object' ? doc.image.id : doc.image
          : null

        if (!hasOg && contentImage) {
          try {
            await payload.update({
              collection: 'use-cases',
              id: doc.id,
              data: { meta: { ...doc.meta, image: contentImage } },
            })
            updated++
          } catch (err) {
            errors.push(`Use case ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
        }
      }

      for (const doc of blogPostsResult.docs || []) {
        const hasOg = doc.meta?.image
          ? typeof doc.meta.image === 'object' ? doc.meta.image.id : doc.meta.image
          : null
        const contentImage = doc.featuredImage
          ? typeof doc.featuredImage === 'object' ? doc.featuredImage.id : doc.featuredImage
          : null

        if (!hasOg && contentImage) {
          try {
            await payload.update({
              collection: 'blog-posts',
              id: doc.id,
              data: { meta: { ...doc.meta, image: contentImage } },
            })
            updated++
          } catch (err) {
            errors.push(`Blog post ${doc.id}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
        }
      }
    } else {
      return NextResponse.json(
        { error: `Unknown action: ${body.action}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      updated,
      errors,
    } as BulkUpdateResponse)
  } catch (error) {
    console.error('SEO Items POST Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update SEO items',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
