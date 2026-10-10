import { NextRequest, NextResponse } from 'next/server'
import { authorizeAdminRequest } from '@/lib/admin-auth'
import {
  MAX_MEDIA_UPLOAD_BYTES,
  validateMediaUpload,
} from '@/lib/media-validation'

export async function POST(request: NextRequest) {
  try {
    const authorization = await authorizeAdminRequest(request, 'write')
    if (!authorization.ok) return authorization.response

    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > MAX_MEDIA_UPLOAD_BYTES + 64 * 1024) {
      return NextResponse.json({ error: 'Media files must be 10 MB or smaller' }, { status: 413 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const alt = (formData.get('alt') as string) || 'OG Image'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const { payload } = authorization

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const detectedMime = validateMediaUpload({
      data: buffer,
      mimetype: file.type,
      name: file.name,
      size: file.size,
    })

    const doc = await payload.create({
      collection: 'media',
      draft: false,
      data: {
        alt,
        provenanceStatus: 'unreviewed',
        permissionStatus: 'unreviewed',
      },
      file: {
        data: buffer,
        mimetype: detectedMime,
        name: file.name,
        size: file.size,
      },
    })

    const url = doc.url || (doc.sizes as any)?.og?.url || (doc.sizes as any)?.card?.url || null

    return NextResponse.json({
      doc: {
        id: doc.id,
        url,
        alt: doc.alt,
        filename: doc.filename,
      },
    })
  } catch (error) {
    console.error('Media upload error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const isValidationError = /file|media|mime|signature|svg|format|extension/i.test(message)
    return NextResponse.json(
      { error: 'Upload failed', message },
      { status: isValidationError ? 400 : 500 },
    )
  }
}
