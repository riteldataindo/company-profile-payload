import { NextRequest, NextResponse } from 'next/server'
import { authorizeAdminRequest, privateAdminHeaders } from '@/lib/admin-auth'
import { auditSeoContent, type SeoCheck } from '@/lib/seo/audit'
import { isValidLocale, type Locale } from '@/lib/i18n/config'

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
  coverage: number
  /** @deprecated Use coverage. Kept temporarily for admin response compatibility. */
  score: number
  checks?: SeoCheck[]
  sourceContent: string | null
  ogImageAlt: string | null
  contentImageAlt: string | null
  hasAuthor: boolean
  hasPublishedAt: boolean
  hasExcerpt: boolean
  url?: string
}

interface SeoItemsResponse {
  items: SeoItem[]
  total: number
}

interface BulkUpdateRequest {
  action: 'auto-generate-descriptions' | 'set-default-image' | 'use-content-images'
  imageId?: string
  locale?: string
}

function getLocale(value: string | null | undefined): Locale {
  return value && isValidLocale(value) ? value : 'en'
}

const META_TEMPLATES: Record<string, Record<string, string>> = {
  en: {
    'blog-posts': 'CCTV AI People Counting & Visitor Analytics',
    features: 'CCTV AI People Counting & Visitor Analytics',
    'use-cases': 'CCTV AI People Counting & Visitor Analytics',
  },
  id: {
    'blog-posts': 'CCTV AI People Counting & Analitik Pengunjung',
    features: 'CCTV AI People Counting & Analitik Pengunjung',
    'use-cases': 'CCTV AI People Counting & Analitik Pengunjung',
  },
}

interface BulkUpdateResponse {
  updated: number
  errors: string[]
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

function extractLexicalText(richText: any): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText
  if (richText.root?.children) {
    return richText.root.children
      .map((node: any) => {
        if (node.children) return node.children.map((c: any) => c.text || '').join('')
        return node.text || ''
      })
      .join('\n\n')
  }
  return ''
}

function mapDocToSeoItem(doc: any, type: 'blog' | 'feature' | 'usecase', allTitles: string[], locale: string): SeoItem {
  let title = ''
  let slug = ''
  let sourceContent: string | null = null
  let hasAuthor = false
  let hasPublishedAt = false
  let hasExcerpt = false

  if (type === 'blog') {
    title = doc.title || ''
    slug = doc.slug || ''
    const bodyText = extractLexicalText(doc.content)
    sourceContent = bodyText || doc.excerpt || null
    hasAuthor = !!(doc.author && (typeof doc.author === 'object' ? doc.author.name : doc.author))
    hasPublishedAt = !!doc.publishedAt
    hasExcerpt = !!(doc.excerpt && doc.excerpt.trim().length > 20)
  } else if (type === 'feature') {
    title = doc.name || ''
    slug = doc.slug || ''
    sourceContent = doc.shortDescription || doc.longDescription || null
  } else {
    title = doc.industryName || ''
    slug = doc.slug || ''
    sourceContent = doc.shortDescription || doc.longDescription || null
  }

  const metaTitle = doc.meta?.title || null
  const metaDescription = doc.meta?.description || null

  const metaImage = doc.meta?.image
  const imageId = metaImage
    ? typeof metaImage === 'object' ? metaImage.id?.toString() || null : metaImage?.toString() || null
    : null
  const ogImageAlt = metaImage && typeof metaImage === 'object' ? (metaImage.alt || null) : null

  const contentImage = doc.featuredImage || doc.image || null
  const contentImageAlt = contentImage && typeof contentImage === 'object'
    ? (contentImage.alt || null)
    : (contentImage ? '' : null)

  const collection = type === 'blog' ? 'blog-posts' : type === 'feature' ? 'features' : 'use-cases'
  const publicSection = type === 'blog' ? 'blog' : type === 'feature' ? 'features' : 'use-cases'
  const scoreDetail = auditSeoContent({
    metaTitle, metaDescription, imageId, ogImageAlt, contentImageAlt,
    sourceContent, allTitles, contentType: type,
    hasAuthor, hasPublishedAt, hasExcerpt,
  })
  return {
    id: doc.id,
    title,
    type,
    collection,
    slug,
    meta: { title: metaTitle, description: metaDescription, imageId },
    coverage: scoreDetail.coverage,
    score: scoreDetail.coverage,
    checks: scoreDetail.checks,
    sourceContent,
    ogImageAlt,
    contentImageAlt,
    hasAuthor,
    hasPublishedAt,
    hasExcerpt,
    url: `/${locale}/${publicSection}/${slug || doc.id}`,
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
    const authorization = await authorizeAdminRequest(request, 'read')
    if (!authorization.ok) return authorization.response

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''
    const locale = getLocale(searchParams.get('locale'))

    const { payload } = authorization

    // Fetch all collections with locale
    const [blogPostsResult, featuresResult, useCasesResult] = await Promise.all([
      payload.find({ collection: 'blog-posts', limit: 1000, locale }),
      payload.find({ collection: 'features', limit: 1000, locale }),
      payload.find({ collection: 'use-cases', limit: 1000, locale }),
    ])

    // Collect all meta titles for duplicate detection
    const allDocs = [
      ...(blogPostsResult.docs || []),
      ...(featuresResult.docs || []),
      ...(useCasesResult.docs || []),
    ]
    const allTitles = allDocs.map(d => d.meta?.title || null).filter(Boolean) as string[]

    let allItems: SeoItem[] = []

    if (type === 'all' || type === 'blog') {
      const blogItems = (blogPostsResult.docs || []).map(doc => mapDocToSeoItem(doc, 'blog', allTitles, locale))
      allItems.push(...blogItems)
    }

    if (type === 'all' || type === 'feature') {
      const featureItems = (featuresResult.docs || []).map(doc => mapDocToSeoItem(doc, 'feature', allTitles, locale))
      allItems.push(...featureItems)
    }

    if (type === 'all' || type === 'usecase') {
      const usecaseItems = (useCasesResult.docs || []).map(doc => mapDocToSeoItem(doc, 'usecase', allTitles, locale))
      allItems.push(...usecaseItems)
    }

    // Apply filters
    const filteredItems = filterItems(allItems, status, search)

    // Sort by score descending
    filteredItems.sort((a, b) => b.score - a.score)

    return NextResponse.json(
      {
        items: filteredItems,
        total: filteredItems.length,
      } as SeoItemsResponse,
      { headers: privateAdminHeaders() },
    )
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
    const authorization = await authorizeAdminRequest(request, 'write')
    if (!authorization.ok) return authorization.response

    const body = (await request.json()) as BulkUpdateRequest

    if (!body.action) {
      return NextResponse.json(
        { error: 'Missing action field' },
        { status: 400 }
      )
    }

    const { payload } = authorization
    const errors: string[] = []
    let updated = 0
    const locale = getLocale(body.locale)
    const templates = META_TEMPLATES[locale] || META_TEMPLATES['en']

    if (body.action === 'auto-generate-descriptions') {
      const [blogPostsResult, featuresResult, useCasesResult] = await Promise.all([
        payload.find({ collection: 'blog-posts', limit: 1000, locale }),
        payload.find({ collection: 'features', limit: 1000, locale }),
        payload.find({ collection: 'use-cases', limit: 1000, locale }),
      ])

      function makeTitle(name: string, collection: string, docId: number | string, allGenerated: string[]): string {
        const nl = ' ' + name.toLowerCase() + ' '
        const hasKw = (kw: string) => kw === 'ai' ? /\bai\b/.test(nl) : nl.includes(kw)
        let suffix: string
        if (hasKw('cctv') && hasKw('people counting')) {
          suffix = 'SmartCounter Retail Analytics'
        } else if (hasKw('cctv') || hasKw('ai')) {
          suffix = 'People Counting & Visitor Analytics'
        } else if (hasKw('people counting')) {
          suffix = 'CCTV AI Retail Analytics'
        } else if (hasKw('visitor')) {
          suffix = 'CCTV AI People Counting'
        } else {
          suffix = templates[collection] || 'CCTV AI People Counting & Visitor Analytics'
        }
        const maxLen = 57 - suffix.length
        const trimmed = name.length > maxLen
          ? (name.substring(0, name.lastIndexOf(' ', maxLen)) || name.substring(0, maxLen))
          : name
        let result = `${trimmed} — ${suffix}`
        if (allGenerated.includes(result)) {
          result = `${trimmed}: ${suffix}`
        }
        allGenerated.push(result)
        return result
      }
      const allGeneratedTitles: string[] = []

      function makeDesc(source: string, name: string): string {
        if (!source) source = `${name} helps retailers optimize operations with accurate data.`
        const sl = source.toLowerCase()
        const hasKw = ['cctv ai', 'people counting', 'visitor analytics', 'analitik pengunjung'].some(k => sl.includes(k))
        if (hasKw && source.length >= 120 && source.length <= 150) return source

        let result = source.replace(/[.\s]+$/, '')
        if (!hasKw) {
          const naturalEnding = locale === 'id'
            ? 'Solusi people counting dan analitik pengunjung dari SmartCounter.'
            : 'Powered by SmartCounter people counting and visitor analytics.'
          const budget = 153 - naturalEnding.length
          if (result.length > budget) {
            const cut = result.substring(0, budget)
            const sp = cut.lastIndexOf(' ')
            result = sp > budget * 0.5 ? cut.substring(0, sp) : cut
          }
          result = `${result}. ${naturalEnding}`
        } else {
          result = result + '.'
        }
        if (result.length < 120) {
          result = result.replace(/\.$/, '') + '. SmartCounter provides accurate real-time data for retail stores.'
        }
        if (result.length > 155) {
          const cut = result.substring(0, 153)
          const sp = cut.lastIndexOf('. ')
          result = sp > 80 ? cut.substring(0, sp + 1) : cut.substring(0, cut.lastIndexOf(' ')) + '.'
        }
        return result
      }

      for (const doc of blogPostsResult.docs || []) {
        const currentTitle = doc.meta?.title || ''
        const currentDesc = doc.meta?.description || ''
        if (currentTitle && currentDesc) continue

        try {
          const t = doc.title || 'SmartCounter'
          const updateData = {
            ...doc.meta,
            title: makeTitle(t, 'blog-posts', doc.id, allGeneratedTitles),
            description: makeDesc(doc.excerpt || '', t),
          }
          await payload.update({ collection: 'blog-posts', id: doc.id, locale, data: { meta: updateData } })
          updated++
        } catch (err) {
          errors.push(`Blog ${doc.id}: ${err instanceof Error ? err.message : 'Unknown'}`)
        }
      }

      for (const doc of featuresResult.docs || []) {
        const currentTitle = doc.meta?.title || ''
        const currentDesc = doc.meta?.description || ''
        if (currentTitle && currentDesc) continue

        try {
          const t = doc.name || 'SmartCounter'
          const updateData = {
            ...doc.meta,
            title: makeTitle(t, 'features', doc.id, allGeneratedTitles),
            description: makeDesc(doc.shortDescription || '', t),
          }
          await payload.update({ collection: 'features', id: doc.id, locale, data: { meta: updateData } })
          updated++
        } catch (err) {
          errors.push(`Feature ${doc.id}: ${err instanceof Error ? err.message : 'Unknown'}`)
        }
      }

      for (const doc of useCasesResult.docs || []) {
        const currentTitle = doc.meta?.title || ''
        const currentDesc = doc.meta?.description || ''
        if (currentTitle && currentDesc) continue

        try {
          const t = doc.industryName || 'SmartCounter'
          const updateData = {
            ...doc.meta,
            title: makeTitle(t, 'use-cases', doc.id, allGeneratedTitles),
            description: makeDesc(doc.shortDescription || '', t),
          }
          await payload.update({ collection: 'use-cases', id: doc.id, locale, data: { meta: updateData } })
          updated++
        } catch (err) {
          errors.push(`UseCase ${doc.id}: ${err instanceof Error ? err.message : 'Unknown'}`)
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
