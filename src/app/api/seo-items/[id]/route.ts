import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

interface UpdateSeoItemRequest {
  collection: string
  meta: {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = (await request.json()) as UpdateSeoItemRequest
    const { id: itemId } = await params

    if (!body.collection) {
      return NextResponse.json(
        { error: 'Missing collection field' },
        { status: 400 }
      )
    }

    // Validate collection
    const validCollections = ['blog-posts', 'features', 'use-cases']
    if (!validCollections.includes(body.collection)) {
      return NextResponse.json(
        { error: `Invalid collection: ${body.collection}` },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Fetch the current document
    const currentDoc = await payload.findByID({
      collection: body.collection as 'blog-posts' | 'features' | 'use-cases',
      id: itemId,
    })

    if (!currentDoc) {
      return NextResponse.json(
        { error: `Item not found in collection ${body.collection}` },
        { status: 404 }
      )
    }

    // Prepare updated meta object
    const updatedMeta = {
      ...currentDoc.meta,
    }

    if (body.meta.title !== undefined) {
      updatedMeta.title = body.meta.title || null
    }

    if (body.meta.description !== undefined) {
      updatedMeta.description = body.meta.description || null
    }

    if (body.meta.image !== undefined) {
      if (body.meta.image === null) {
        updatedMeta.image = null
      } else if (body.meta.image) {
        // Convert string image ID to number
        updatedMeta.image = parseInt(body.meta.image, 10)
      }
    }

    // Update the document
    const updated = await payload.update({
      collection: body.collection as 'blog-posts' | 'features' | 'use-cases',
      id: itemId,
      data: {
        meta: updatedMeta,
      },
    })

    // Get title based on collection type
    let title = ''
    if (body.collection === 'blog-posts') {
      title = updated.title || ''
    } else if (body.collection === 'features') {
      title = updated.name || ''
    } else if (body.collection === 'use-cases') {
      title = updated.industryName || ''
    }

    const slug = updated.slug || ''

    // Format image ID
    const imageId = updated.meta?.image
      ? typeof updated.meta.image === 'object'
        ? updated.meta.image.id?.toString() || null
        : updated.meta.image?.toString() || null
      : null

    const response: UpdatedSeoItem = {
      id: updated.id,
      title,
      slug,
      collection: body.collection,
      meta: {
        title: updated.meta?.title || null,
        description: updated.meta?.description || null,
        imageId,
      },
      updatedAt: updated.updatedAt || new Date().toISOString(),
    }

    return NextResponse.json(response)
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
