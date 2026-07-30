import { NextRequest, NextResponse } from 'next/server'
import { authorizeAdminRequest, privateAdminHeaders } from '@/lib/admin-auth'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import type { BlogPost, Feature, Media, UseCase } from '@/payload-types'

type SeoCollection = 'blog-posts' | 'features' | 'use-cases'

function getLocale(value?: string): Locale {
  return value && isValidLocale(value) ? value : 'en'
}

interface UpdateSeoItemRequest {
  collection: string
  locale?: string
  slug?: string
  meta?: {
    title?: string
    description?: string
    image?: string | null
  }
}

interface UpdatedSeoItem {
  id: string
  title: string
  slug: string
  collection: string
  meta: {
    title: string | null
    description: string | null
    imageId: string | null
  }
  updatedAt: string
}

interface SeoMeta {
  title?: string | null
  description?: string | null
  image?: number | Media | null
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdminRequest(request, 'write')
    if (!authorization.ok) return authorization.response

    const body = (await request.json()) as UpdateSeoItemRequest
    const { id: itemId } = await params

    if (!body.collection) {
      return NextResponse.json(
        { error: 'Missing collection field' },
        { status: 400 }
      )
    }

    // Validate collection
    const validCollections: SeoCollection[] = ['blog-posts', 'features', 'use-cases']
    if (!validCollections.includes(body.collection as SeoCollection)) {
      return NextResponse.json(
        { error: `Invalid collection: ${body.collection}` },
        { status: 400 }
      )
    }

    const { payload } = authorization

    const locale = getLocale(body.locale)
    const collection = body.collection as SeoCollection

    let currentDoc: BlogPost | Feature | UseCase
    if (collection === 'blog-posts') {
      currentDoc = await payload.findByID({ collection, id: itemId, locale })
    } else if (collection === 'features') {
      currentDoc = await payload.findByID({ collection, id: itemId, locale })
    } else {
      currentDoc = await payload.findByID({ collection, id: itemId, locale })
    }

    if (!currentDoc) {
      return NextResponse.json(
        { error: `Item not found in collection ${body.collection}` },
        { status: 404 }
      )
    }

    const updatedMeta: SeoMeta = {
      ...((currentDoc.meta as SeoMeta | undefined) ?? {}),
    }
    if (body.meta?.title !== undefined) updatedMeta.title = body.meta.title || null
    if (body.meta?.description !== undefined) updatedMeta.description = body.meta.description || null
    if (body.meta?.image !== undefined) {
      const parsedImageId = body.meta.image ? Number.parseInt(body.meta.image, 10) : null
      if (body.meta.image && Number.isNaN(parsedImageId)) {
        return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 })
      }
      updatedMeta.image = body.meta.image === null ? null : parsedImageId
    }

    const updateData = {
      ...(body.meta && { meta: updatedMeta }),
      ...(body.slug && { slug: body.slug }),
    }

    let updated: BlogPost | Feature | UseCase
    if (collection === 'blog-posts') {
      updated = await payload.update({ collection, id: itemId, locale, data: updateData })
    } else if (collection === 'features') {
      updated = await payload.update({ collection, id: itemId, locale, data: updateData })
    } else {
      updated = await payload.update({ collection, id: itemId, locale, data: updateData })
    }

    // Get title based on collection type
    let title = ''
    if (collection === 'blog-posts' && 'title' in updated) {
      title = updated.title || ''
    } else if (collection === 'features' && 'name' in updated) {
      title = updated.name || ''
    } else if (collection === 'use-cases' && 'industryName' in updated) {
      title = updated.industryName || ''
    }

    const slug = updated.slug || ''

    // Format image ID
    const responseMeta = updated.meta as SeoMeta | undefined
    const imageId = responseMeta?.image
      ? typeof responseMeta.image === 'object'
        ? responseMeta.image.id?.toString() || null
        : responseMeta.image.toString() || null
      : null

    const response: UpdatedSeoItem = {
      id: String(updated.id),
      title,
      slug,
      collection: body.collection,
      meta: {
        title: responseMeta?.title || null,
        description: responseMeta?.description || null,
        imageId,
      },
      updatedAt: updated.updatedAt || new Date().toISOString(),
    }

    return NextResponse.json(response, { headers: privateAdminHeaders() })
  } catch (error) {
    console.error('SEO Item PATCH Error:', error)

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to update SEO item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
