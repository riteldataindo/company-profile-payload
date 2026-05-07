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
  action: 'auto-generate-descriptions' | 'set-default-image'
  imageId?: string
  locale?: string
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

const TOPIC_KEYWORDS = ['people counting', 'cctv ai', 'visitor analytics', 'analitik pengunjung', 'smart cctv', 'ai camera', 'foot traffic', 'retail analytics']

interface SeoCheck { name: string; score: number; max: number; status: 'green' | 'amber' | 'red'; tip: string; tier: 'high' | 'medium' | 'info' | 'geo' }
interface SeoScoreDetail { score: number; checks: SeoCheck[] }

function getBigrams(text: string): string[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean)
  const bigrams: string[] = []
  for (let i = 0; i < words.length - 1; i++) bigrams.push(`${words[i]} ${words[i + 1]}`)
  return bigrams
}

interface ScoreContext {
  metaTitle: string | null
  metaDescription: string | null
  imageId: string | null
  ogImageAlt: string | null
  contentImageAlt: string | null
  sourceContent: string | null
  allTitles: string[]
  contentType: 'blog' | 'feature' | 'usecase'
  hasAuthor: boolean
  hasPublishedAt: boolean
  hasExcerpt: boolean
}

function calculateSeoScore(ctx: ScoreContext): SeoScoreDetail {
  const checks: SeoCheck[] = []
  const title = ctx.metaTitle || ''
  const desc = ctx.metaDescription || ''

  // ===== HIGH WEIGHT — Technical On-Page (38 pts) =====

  // H1. Title presence + length (8 pts)
  const titleLen = title.length
  if (titleLen >= 50 && titleLen <= 60) {
    checks.push({ name: 'Title Length', score: 8, max: 8, status: 'green', tip: `${titleLen} chars — optimal (50-60)`, tier: 'high' })
  } else if (titleLen >= 30 && titleLen <= 70) {
    checks.push({ name: 'Title Length', score: 5, max: 8, status: 'amber', tip: `${titleLen} chars — acceptable, optimal 50-60`, tier: 'high' })
  } else if (titleLen > 0) {
    checks.push({ name: 'Title Length', score: 2, max: 8, status: 'red', tip: `${titleLen} chars — should be 50-60`, tier: 'high' })
  } else {
    checks.push({ name: 'Title Length', score: 0, max: 8, status: 'red', tip: 'Missing meta title', tier: 'high' })
  }

  // H2. Title unique (7 pts)
  const dupes = ctx.allTitles.filter(t => t === ctx.metaTitle).length
  checks.push(dupes <= 1
    ? { name: 'Title Unique', score: 7, max: 7, status: 'green', tip: 'Unique across all items', tier: 'high' }
    : { name: 'Title Unique', score: 0, max: 7, status: 'red', tip: `Duplicate (${dupes} items share this title)`, tier: 'high' })

  // H3. Title natural — no artifacts, no bigram spam (6 pts)
  const artifactPatterns = [/ for —/, / for -/, / by \./, /— —/, /  /, /\[[\d]+\]/, /\.{2,}/]
  const hasArtifact = artifactPatterns.some(p => p.test(title))
  const titleBigrams = getBigrams(title)
  const bigramCounts = new Map<string, number>()
  for (const bg of titleBigrams) bigramCounts.set(bg, (bigramCounts.get(bg) || 0) + 1)
  const repeatedBigrams = Array.from(bigramCounts.entries()).filter(([, c]) => c >= 3)
  const truncatedEnd = /^.{5,}\s\w{1,4}$/.test(title.split('—')[0]?.trim() || '')

  if (!hasArtifact && repeatedBigrams.length === 0 && !truncatedEnd) {
    checks.push({ name: 'Title Natural', score: 6, max: 6, status: 'green', tip: 'Reads naturally, no repetition', tier: 'high' })
  } else {
    const issues: string[] = []
    if (hasArtifact) issues.push('auto-gen artifact')
    if (repeatedBigrams.length > 0) issues.push(`repeated: "${repeatedBigrams[0][0]}" (${repeatedBigrams[0][1]}x)`)
    if (truncatedEnd) issues.push('truncated word')
    checks.push({ name: 'Title Natural', score: 0, max: 6, status: 'red', tip: issues.join('; '), tier: 'high' })
  }

  // H4. OG Image present (7 pts)
  checks.push(ctx.imageId
    ? { name: 'OG Image', score: 7, max: 7, status: 'green', tip: 'Present — multi-modal = 156% higher AI selection', tier: 'high' }
    : { name: 'OG Image', score: 0, max: 7, status: 'red', tip: 'Missing — needed for social sharing + AI citations', tier: 'high' })

  // H5. OG Image alt text (6 pts)
  if (!ctx.imageId) {
    checks.push({ name: 'OG Image Alt', score: 0, max: 6, status: 'red', tip: 'No OG image to check', tier: 'high' })
  } else if (ctx.ogImageAlt && ctx.ogImageAlt.trim().length > 3) {
    checks.push({ name: 'OG Image Alt', score: 6, max: 6, status: 'green', tip: 'Alt text present', tier: 'high' })
  } else {
    checks.push({ name: 'OG Image Alt', score: 0, max: 6, status: 'amber', tip: 'OG image missing alt text — add in Media library', tier: 'high' })
  }

  // H6. Content image alt (4 pts)
  if (ctx.contentImageAlt && ctx.contentImageAlt.trim().length > 3) {
    checks.push({ name: 'Content Image Alt', score: 4, max: 4, status: 'green', tip: 'Featured image has alt text', tier: 'high' })
  } else if (ctx.contentImageAlt !== null) {
    checks.push({ name: 'Content Image Alt', score: 0, max: 4, status: 'amber', tip: 'Featured image missing alt text', tier: 'high' })
  } else {
    checks.push({ name: 'Content Image Alt', score: 2, max: 4, status: 'amber', tip: 'No featured image uploaded', tier: 'high' })
  }

  // ===== MEDIUM WEIGHT — CTR & Trust (30 pts) =====

  // M1. Meta description length — for CTR, not ranking (7 pts)
  const descLen = desc.length
  if (descLen >= 120 && descLen <= 150) {
    checks.push({ name: 'Desc Length', score: 7, max: 7, status: 'green', tip: `${descLen} chars — optimal for SERP CTR (120-150)`, tier: 'medium' })
  } else if (descLen >= 80) {
    checks.push({ name: 'Desc Length', score: 4, max: 7, status: 'amber', tip: `${descLen} chars — ideal 120-150 for CTR`, tier: 'medium' })
  } else if (descLen > 0) {
    checks.push({ name: 'Desc Length', score: 2, max: 7, status: 'amber', tip: `${descLen} chars — too short, Google may replace it`, tier: 'medium' })
  } else {
    checks.push({ name: 'Desc Length', score: 0, max: 7, status: 'red', tip: 'Missing — Google will auto-generate from content', tier: 'medium' })
  }

  // M2. Meta description reads naturally — no keyword stuffing, proper sentences (6 pts)
  const descSentences = desc.split(/\.\s*/).filter(s => s.trim().length > 3)
  const lastSentence = descSentences[descSentences.length - 1] || ''
  const lastHasVerb = /\b(is|are|was|were|help|helps|track|tracks|use|uses|learn|get|see|boost|drive|reduce|increase|monitor|detect|count|provide|ensure|transform|optimize|measure|improve|untuk|dengan|yang|dapat|bisa|membantu|menggunakan|menyediakan)\b/i.test(lastSentence)

  let descNatScore = 0
  const descIssues: string[] = []
  if (descSentences.length >= 1) descNatScore += 3; else descIssues.push('no complete sentences')
  if (lastHasVerb || lastSentence.length > 25) descNatScore += 4; else descIssues.push('ends abruptly — not a natural sentence')

  if (descNatScore >= 6) {
    checks.push({ name: 'Desc Natural', score: 6, max: 6, status: 'green', tip: 'Reads as natural copy', tier: 'medium' })
  } else if (descNatScore >= 3) {
    checks.push({ name: 'Desc Natural', score: Math.min(descNatScore, 6), max: 6, status: 'amber', tip: descIssues.join('; '), tier: 'medium' })
  } else {
    checks.push({ name: 'Desc Natural', score: descNatScore, max: 6, status: 'red', tip: descIssues.join('; '), tier: 'medium' })
  }

  // M3-M5. E-E-A-T signals (17 pts total)
  if (ctx.contentType === 'blog') {
    checks.push(ctx.hasAuthor
      ? { name: 'E-E-A-T: Author', score: 6, max: 6, status: 'green', tip: 'Author attributed — builds credibility + Person schema', tier: 'medium' }
      : { name: 'E-E-A-T: Author', score: 0, max: 6, status: 'red', tip: 'No author — hurts trust for B2B content', tier: 'medium' })

    checks.push(ctx.hasPublishedAt
      ? { name: 'E-E-A-T: Date', score: 5, max: 5, status: 'green', tip: 'Published date set — shows freshness', tier: 'medium' }
      : { name: 'E-E-A-T: Date', score: 0, max: 5, status: 'red', tip: 'No published date — content looks undated', tier: 'medium' })

    checks.push(ctx.hasExcerpt
      ? { name: 'E-E-A-T: Excerpt', score: 6, max: 6, status: 'green', tip: 'Summary present — helps SERP snippets & AI citations', tier: 'medium' }
      : { name: 'E-E-A-T: Excerpt', score: 0, max: 6, status: 'amber', tip: 'No excerpt — Google picks random text', tier: 'medium' })
  } else {
    const contentLen = (ctx.sourceContent || '').length
    if (contentLen >= 200) {
      checks.push({ name: 'E-E-A-T: Depth', score: 17, max: 17, status: 'green', tip: 'Detailed description demonstrates expertise', tier: 'medium' })
    } else if (contentLen >= 50) {
      checks.push({ name: 'E-E-A-T: Depth', score: 10, max: 17, status: 'amber', tip: 'Description could be more detailed for authority', tier: 'medium' })
    } else {
      checks.push({ name: 'E-E-A-T: Depth', score: 0, max: 17, status: 'red', tip: 'Thin description — lacks expertise signal', tier: 'medium' })
    }
  }

  // ===== GEO — AI Search Readiness (17 pts) =====

  // G1. Opening definition — "X is/adalah..." in first 60 words (7 pts)
  const contentText = ctx.sourceContent || ''
  const first60Words = contentText.split(/\s+/).slice(0, 60).join(' ').toLowerCase()
  const hasDefinition = /\b(adalah|is|refers to|merupakan|yaitu|ialah)\b/.test(first60Words)
  if (hasDefinition) {
    checks.push({ name: 'Opening Definition', score: 7, max: 7, status: 'green', tip: 'Starts with definition — optimal for AI citation extraction', tier: 'geo' })
  } else if (contentText.length > 0) {
    checks.push({ name: 'Opening Definition', score: 2, max: 7, status: 'amber', tip: 'No "X is/adalah..." in first 60 words — add clear definition for AI Overviews', tier: 'geo' })
  } else {
    checks.push({ name: 'Opening Definition', score: 0, max: 7, status: 'red', tip: 'No content — AI crawlers need SSR text', tier: 'geo' })
  }

  // G2. Citability blocks — paragraphs of 134-167 words that can be extracted standalone (10 pts)
  const paragraphs = contentText.split(/\n\n+|\r\n\r\n+/).filter(p => p.trim().length > 50)
  const citableBlocks = paragraphs.filter(p => {
    const wc = p.trim().split(/\s+/).length
    return wc >= 100 && wc <= 200
  })
  if (citableBlocks.length >= 2) {
    checks.push({ name: 'Citability Blocks', score: 10, max: 10, status: 'green', tip: `${citableBlocks.length} citable passages (100-200 words) — optimal for AI citation`, tier: 'geo' })
  } else if (citableBlocks.length === 1) {
    checks.push({ name: 'Citability Blocks', score: 6, max: 10, status: 'amber', tip: '1 citable passage — aim for 2+ self-contained answer blocks (100-200 words each)', tier: 'geo' })
  } else {
    const avgParaWords = paragraphs.length > 0 ? Math.round(paragraphs.reduce((s, p) => s + p.split(/\s+/).length, 0) / paragraphs.length) : 0
    checks.push({ name: 'Citability Blocks', score: 2, max: 10, status: 'amber', tip: `No 100-200 word passages (avg ${avgParaWords} words) — AI needs self-contained answer blocks`, tier: 'geo' })
  }

  // ===== INFORMATIONAL (15 pts) =====

  // I1. Content depth — word count with type-specific thresholds (10 pts)
  const contentWords = contentText.split(/\s+/).filter(Boolean).length
  const greenWords = ctx.contentType === 'blog' ? 800 : 300
  const amberWords = ctx.contentType === 'blog' ? 400 : 100
  if (contentWords >= greenWords) {
    checks.push({ name: 'Content Depth', score: 10, max: 10, status: 'green', tip: `${contentWords} words — comprehensive topical coverage`, tier: 'info' })
  } else if (contentWords >= amberWords) {
    checks.push({ name: 'Content Depth', score: 6, max: 10, status: 'amber', tip: `${contentWords} words — ${ctx.contentType === 'blog' ? 'target 800+ for depth' : 'consider expanding'}`, tier: 'info' })
  } else if (contentWords > 0) {
    checks.push({ name: 'Content Depth', score: 3, max: 10, status: 'amber', tip: `${contentWords} words — thin content risk`, tier: 'info' })
  } else {
    checks.push({ name: 'Content Depth', score: 0, max: 10, status: 'red', tip: 'No content body', tier: 'info' })
  }

  // I2. Topic relevance indicator (5 pts)
  const tl = title.toLowerCase()
  const topicMatches = TOPIC_KEYWORDS.filter(k => tl.includes(k))
  if (topicMatches.length >= 1) {
    checks.push({ name: 'Topic Indicator', score: 5, max: 5, status: 'green', tip: `Topic keyword in title: "${topicMatches[0]}"`, tier: 'info' })
  } else {
    const contentLower = contentText.toLowerCase()
    const contentMatches = TOPIC_KEYWORDS.filter(k => contentLower.includes(k))
    if (contentMatches.length >= 1) {
      checks.push({ name: 'Topic Indicator', score: 3, max: 5, status: 'amber', tip: `Topic found in content but not title — OK if semantically covered`, tier: 'info' })
    } else {
      checks.push({ name: 'Topic Indicator', score: 2, max: 5, status: 'amber', tip: 'No exact topic keyword — fine if BERT/MUM semantic match covers it', tier: 'info' })
    }
  }

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0)
  return { score: totalScore, checks }
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

function mapDocToSeoItem(doc: any, type: 'blog' | 'feature' | 'usecase', allTitles: string[]): SeoItem {
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
  const scoreDetail = calculateSeoScore({
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
    score: scoreDetail.score,
    checks: scoreDetail.checks,
    sourceContent,
    ogImageAlt,
    contentImageAlt,
    hasAuthor,
    hasPublishedAt,
    hasExcerpt,
    url: `/${collection}/${slug || doc.id}`,
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
    const locale = searchParams.get('locale') || 'en'

    const payload = await getPayload({ config: configPromise })

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
      const blogItems = (blogPostsResult.docs || []).map(doc => mapDocToSeoItem(doc, 'blog', allTitles))
      allItems.push(...blogItems)
    }

    if (type === 'all' || type === 'feature') {
      const featureItems = (featuresResult.docs || []).map(doc => mapDocToSeoItem(doc, 'feature', allTitles))
      allItems.push(...featureItems)
    }

    if (type === 'all' || type === 'usecase') {
      const usecaseItems = (useCasesResult.docs || []).map(doc => mapDocToSeoItem(doc, 'usecase', allTitles))
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
    const locale = body.locale || 'en'
    const templates = META_TEMPLATES[locale] || META_TEMPLATES['en']

    if (body.action === 'auto-generate-descriptions' || body.action === 'auto-fix-all') {
      const fixTitles = body.action === 'auto-fix-all'

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
        const titleScore = currentTitle.length >= 30 && currentTitle.length <= 60 ? 30 : 0
        const descScore = currentDesc.length >= 100 && currentDesc.length <= 160 ? 40 : 0
        if (titleScore === 30 && descScore === 40 && !fixTitles) continue

        try {
          const updateData: Record<string, unknown> = { ...doc.meta }
          const t = doc.title || 'SmartCounter'
          updateData.title = makeTitle(t, 'blog-posts', doc.id, allGeneratedTitles)
          updateData.description = makeDesc(doc.excerpt || '', t)
          await payload.update({ collection: 'blog-posts', id: doc.id, locale, data: { meta: updateData } })
          updated++
        } catch (err) {
          errors.push(`Blog ${doc.id}: ${err instanceof Error ? err.message : 'Unknown'}`)
        }
      }

      for (const doc of featuresResult.docs || []) {
        const currentTitle = doc.meta?.title || ''
        const currentDesc = doc.meta?.description || ''
        const titleScore = currentTitle.length >= 30 && currentTitle.length <= 60 ? 30 : 0
        const descScore = currentDesc.length >= 100 && currentDesc.length <= 160 ? 40 : 0
        if (titleScore === 30 && descScore === 40 && !fixTitles) continue

        try {
          const updateData: Record<string, unknown> = { ...doc.meta }
          const t = doc.name || 'SmartCounter'
          updateData.title = makeTitle(t, 'features', doc.id, allGeneratedTitles)
          updateData.description = makeDesc(doc.shortDescription || '', t)
          await payload.update({ collection: 'features', id: doc.id, locale, data: { meta: updateData } })
          updated++
        } catch (err) {
          errors.push(`Feature ${doc.id}: ${err instanceof Error ? err.message : 'Unknown'}`)
        }
      }

      for (const doc of useCasesResult.docs || []) {
        const currentTitle = doc.meta?.title || ''
        const currentDesc = doc.meta?.description || ''
        const titleScore = currentTitle.length >= 30 && currentTitle.length <= 60 ? 30 : 0
        const descScore = currentDesc.length >= 100 && currentDesc.length <= 160 ? 40 : 0
        if (titleScore === 30 && descScore === 40 && !fixTitles) continue

        try {
          const updateData: Record<string, unknown> = { ...doc.meta }
          const t = doc.industryName || 'SmartCounter'
          updateData.title = makeTitle(t, 'use-cases', doc.id, allGeneratedTitles)
          updateData.description = makeDesc(doc.shortDescription || '', t)
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
