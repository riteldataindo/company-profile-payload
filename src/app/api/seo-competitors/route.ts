import { NextRequest, NextResponse } from 'next/server'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { createHash } from 'crypto'
import path from 'path'
import { authorizeAdminRequest, privateAdminHeaders } from '@/lib/admin-auth'
import { fetchPublicHtml, validatePublicUrl } from '@/lib/safe-fetch'

const CACHE_DIR = path.join(process.cwd(), 'data', 'competitor-cache')
const CACHE_TTL = 24 * 60 * 60 * 1000
const MAX_CACHE_FILES = 200
const USER_RATE_WINDOW_MS = 10 * 60 * 1000
const USER_RATE_MAX = 10
const userRequests = new Map<string, number[]>()

interface PageMetrics {
  url: string
  domain: string
  title: string
  titleLength: number
  description: string
  descLength: number
  wordCount: number
  hasSchema: boolean
  schemaTypes: string[]
  imageCount: number
  h1: string
  h2Count: number
  fetchedAt: string
}

function getCachePath(url: string): string {
  const safe = createHash('sha256').update(url).digest('hex')
  return path.join(CACHE_DIR, `${safe}.json`)
}

function readCache(url: string): PageMetrics | null {
  const fp = getCachePath(url)
  if (!existsSync(fp)) return null
  try {
    const data: PageMetrics = JSON.parse(readFileSync(fp, 'utf-8'))
    if (Date.now() - new Date(data.fetchedAt).getTime() > CACHE_TTL) return null
    return data
  } catch { return null }
}

function writeCache(url: string, data: PageMetrics) {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true })
  const now = Date.now()
  const cacheFiles = readdirSync(CACHE_DIR)
    .filter(filename => filename.endsWith('.json'))
    .flatMap((filename) => {
      const filePath = path.join(CACHE_DIR, filename)
      try {
        return [{ filePath, modifiedAt: statSync(filePath).mtimeMs }]
      } catch {
        return []
      }
    })
    .sort((a, b) => a.modifiedAt - b.modifiedAt)

  for (const entry of cacheFiles) {
    if (now - entry.modifiedAt > CACHE_TTL) {
      try { unlinkSync(entry.filePath) } catch {}
    }
  }
  const retained = cacheFiles.filter(entry => (
    existsSync(entry.filePath) && now - entry.modifiedAt <= CACHE_TTL
  ))
  while (retained.length >= MAX_CACHE_FILES) {
    const oldest = retained.shift()
    if (oldest) {
      try { unlinkSync(oldest.filePath) } catch {}
    }
  }
  writeFileSync(getCachePath(url), JSON.stringify(data, null, 2))
}

function consumeUserRequest(userId: string): boolean {
  const now = Date.now()
  const recent = (userRequests.get(userId) || [])
    .filter(timestamp => timestamp > now - USER_RATE_WINDOW_MS)
  if (recent.length >= USER_RATE_MAX) {
    userRequests.set(userId, recent)
    return false
  }
  recent.push(now)
  userRequests.set(userId, recent)
  return true
}

function extractMeta(html: string, tag: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${tag}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${tag}["']`, 'i'),
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m) return m[1]
  }
  return ''
}

function extractText(html: string): string {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text
}

async function analyzeUrl(url: string): Promise<PageMetrics> {
  const cached = readCache(url)
  if (cached) return cached

  try {
    const { html, finalUrl } = await fetchPublicHtml(url)

    const domain = finalUrl.hostname
    const title = extractMeta(html, 'og:title') || (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '').trim()
    const description = extractMeta(html, 'og:description') || extractMeta(html, 'description')
    const bodyText = extractText(html)
    const wordCount = bodyText.split(/\s+/).filter(w => w.length > 1).length
    const schemaBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
    const schemaTypes = schemaBlocks.map(b => {
      try {
        const json = JSON.parse(b.replace(/<\/?script[^>]*>/gi, ''))
        return json['@type'] || '?'
      } catch { return '?' }
    }).filter(t => t !== '?')
    const imageCount = (html.match(/<img\s/gi) || []).length
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]+>/g, '').trim()
    const h2Count = (html.match(/<h2[\s>]/gi) || []).length

    const metrics: PageMetrics = {
      url, domain, title, titleLength: title.length,
      description, descLength: description.length,
      wordCount, hasSchema: schemaTypes.length > 0, schemaTypes,
      imageCount, h1, h2Count, fetchedAt: new Date().toISOString(),
    }
    writeCache(url, metrics)
    return metrics
  } catch (err) {
    return {
      url, domain: new URL(url).hostname,
      title: '(fetch failed)', titleLength: 0,
      description: '', descLength: 0,
      wordCount: 0, hasSchema: false, schemaTypes: [],
      imageCount: 0, h1: '', h2Count: 0,
      fetchedAt: new Date().toISOString(),
    }
  }
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeAdminRequest(request, 'read')
  if (!authorization.ok) return authorization.response
  const { COMPETITORS, TOPIC_MAP } = await import('@/admin/data/competitors')
  return NextResponse.json(
    { competitors: COMPETITORS, topics: TOPIC_MAP },
    { headers: privateAdminHeaders() },
  )
}

export async function POST(request: NextRequest) {
  try {
    const authorization = await authorizeAdminRequest(request, 'read')
    if (!authorization.ok) return authorization.response
    if (!consumeUserRequest(String(authorization.user.id))) {
      return NextResponse.json(
        { error: 'Too many analysis requests. Please try again later.' },
        { status: 429, headers: privateAdminHeaders() },
      )
    }

    const body = await request.json()
    const { yourUrl, competitorUrls } = body as { yourUrl?: string; competitorUrls: string[] }

    if (!competitorUrls || competitorUrls.length === 0) {
      return NextResponse.json({ error: 'No competitor URLs provided' }, { status: 400 })
    }

    const requestedUrls = [yourUrl, ...competitorUrls.slice(0, 5)].filter(
      (url): url is string => typeof url === 'string' && url.length > 0,
    )
    try {
      await Promise.all(requestedUrls.map(validatePublicUrl))
    } catch (error) {
      return NextResponse.json(
        { error: 'Unsafe or invalid URL', message: error instanceof Error ? error.message : 'Invalid URL' },
        { status: 400, headers: privateAdminHeaders() },
      )
    }

    const results: PageMetrics[] = []
    let yourMetrics: PageMetrics | null = null

    if (yourUrl) {
      yourMetrics = await analyzeUrl(yourUrl)
    }

    for (const url of competitorUrls.slice(0, 5)) {
      results.push(await analyzeUrl(url))
    }

    const avgTitle = results.reduce((s, r) => s + r.titleLength, 0) / results.length || 0
    const avgDesc = results.reduce((s, r) => s + r.descLength, 0) / results.length || 0
    const avgWords = results.reduce((s, r) => s + r.wordCount, 0) / results.length || 0
    const avgH2 = results.reduce((s, r) => s + r.h2Count, 0) / results.length || 0
    const schemaRate = results.filter(r => r.hasSchema).length / results.length * 100

    const insights: string[] = []
    if (yourMetrics) {
      if (yourMetrics.titleLength < avgTitle * 0.8) insights.push(`Your title is ${Math.round(avgTitle - yourMetrics.titleLength)} chars shorter than competitor average`)
      if (yourMetrics.descLength < avgDesc * 0.8) insights.push(`Your description is ${Math.round(avgDesc - yourMetrics.descLength)} chars shorter than competitors`)
      if (yourMetrics.wordCount < avgWords * 0.7) insights.push(`Your content is ${Math.round((1 - yourMetrics.wordCount / avgWords) * 100)}% shorter than competitor average`)
      if (!yourMetrics.hasSchema && schemaRate > 50) insights.push(`${Math.round(schemaRate)}% of competitors use structured data — consider adding schema`)
      if (yourMetrics.h2Count < avgH2 * 0.5) insights.push(`Competitors average ${Math.round(avgH2)} H2 headings vs your ${yourMetrics.h2Count} — add more sections`)
      if (yourMetrics.wordCount >= avgWords && yourMetrics.titleLength >= avgTitle * 0.9) insights.push('Your page is competitive — content depth and title length match or exceed competitors')
    }

    return NextResponse.json({
      your: yourMetrics,
      competitors: results,
      averages: { titleLength: Math.round(avgTitle), descLength: Math.round(avgDesc), wordCount: Math.round(avgWords), h2Count: Math.round(avgH2), schemaRate: Math.round(schemaRate) },
      insights,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Analysis failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
