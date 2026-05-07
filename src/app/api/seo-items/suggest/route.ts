import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { generateSeoSuggestion, extractRichText } from '@/lib/seo/suggest'

export async function POST(request: NextRequest) {
  try {
    const { id, collection, locale = 'en' } = await request.json()

    if (!id || !collection) {
      return NextResponse.json({ error: 'Missing id or collection' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const doc = await payload.findByID({
      collection: collection as 'blog-posts' | 'features' | 'use-cases',
      id,
      locale,
      depth: 0,
    })

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const [blogs, features, useCases] = await Promise.all([
      payload.find({ collection: 'blog-posts', limit: 100, locale, depth: 0 }),
      payload.find({ collection: 'features', limit: 100, locale, depth: 0 }),
      payload.find({ collection: 'use-cases', limit: 100, locale, depth: 0 }),
    ])
    const existingTitles = [
      ...(blogs.docs || []).map((d: any) => d.meta?.title).filter(Boolean),
      ...(features.docs || []).map((d: any) => d.meta?.title).filter(Boolean),
      ...(useCases.docs || []).map((d: any) => d.meta?.title).filter(Boolean),
    ] as string[]

    let name = ''
    let excerpt = ''
    let fullContent = ''

    if (collection === 'blog-posts') {
      name = (doc as any).title || ''
      excerpt = (doc as any).excerpt || ''
      fullContent = extractRichText((doc as any).content)
    } else if (collection === 'features') {
      name = (doc as any).name || ''
      excerpt = (doc as any).shortDescription || ''
      fullContent = extractRichText((doc as any).longDescription)
    } else {
      name = (doc as any).industryName || ''
      excerpt = (doc as any).shortDescription || ''
      fullContent = extractRichText((doc as any).longDescription)
    }

    const result = generateSeoSuggestion({ name, excerpt, fullContent, existingTitles })

    return NextResponse.json({
      title: result.title,
      description: result.description,
      meta: {
        nameUsed: name,
        excerptLength: excerpt.length,
        contentLength: fullContent.length,
        contentWords: fullContent.split(/\s+/).filter(Boolean).length,
        topTerms: result.topTerms.map(t => ({ term: t.term, score: Math.round(t.score * 100) / 100 })),
        topSentences: result.topSentences.map(s => ({ text: s.text.substring(0, 80), score: Math.round(s.score * 100) / 100 })),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
