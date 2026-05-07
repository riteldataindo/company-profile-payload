import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

const OG_DIR = path.join(process.cwd(), 'public', 'og', 'generated')

const BLOG_OG_MAP: Record<number, string> = {
  1: 'blog-people-counting-retail.png',
  2: 'blog-mall-benchmarking.png',
  3: 'blog-fashion-fitting.png',
  4: 'blog-privacy-demographics.png',
  5: 'blog-queue-management.png',
  6: 'blog-occupancy-safety.png',
  9: 'blog-conversion-rate.png',
  10: 'blog-apa-itu-people-counting.png',
  11: 'blog-cara-kerja-cctv-ai.png',
  12: 'blog-manfaat-visitor-counter.png',
  13: 'blog-cctv-ai-visitor-analytics.png',
}

const USECASE_OG_MAP: Record<number, string> = {
  1: 'usecase-retail.png',
  2: 'usecase-mall.png',
  3: 'usecase-fashion.png',
  4: 'usecase-pharmacy.png',
  5: 'usecase-supermarket.png',
  6: 'usecase-luxury.png',
}

async function uploadAndGetId(payload: any, filename: string, alt: string): Promise<number | null> {
  try {
    const filePath = path.join(OG_DIR, filename)
    const buffer = readFileSync(filePath)
    const file = {
      data: buffer,
      mimetype: 'image/png',
      name: filename,
      size: buffer.length,
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt },
      file,
    })
    return created.id
  } catch (err) {
    console.error(`Upload failed for ${filename}:`, err)
    return null
  }
}

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise })
    const results = { uploaded: 0, assigned: 0, errors: [] as string[] }

    // Upload and assign blog post OG images
    for (const [idStr, filename] of Object.entries(BLOG_OG_MAP)) {
      const blogId = parseInt(idStr, 10)
      const mediaId = await uploadAndGetId(payload, filename, `OG Image — ${filename.replace('.png', '')}`)
      if (!mediaId) {
        results.errors.push(`Upload failed: ${filename}`)
        continue
      }
      results.uploaded++

      try {
        await payload.update({
          collection: 'blog-posts',
          id: blogId,
          locale: 'en',
          data: { featuredImage: mediaId, meta: { image: mediaId } },
        })
        await payload.update({
          collection: 'blog-posts',
          id: blogId,
          locale: 'id',
          data: { featuredImage: mediaId, meta: { image: mediaId } },
        })
        results.assigned++
      } catch (err) {
        results.errors.push(`Assign blog ${blogId}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Upload and assign use case OG images
    for (const [idStr, filename] of Object.entries(USECASE_OG_MAP)) {
      const ucId = parseInt(idStr, 10)
      const mediaId = await uploadAndGetId(payload, filename, `OG Image — ${filename.replace('.png', '')}`)
      if (!mediaId) {
        results.errors.push(`Upload failed: ${filename}`)
        continue
      }
      results.uploaded++

      try {
        await payload.update({
          collection: 'use-cases',
          id: ucId,
          locale: 'en',
          data: { meta: { image: mediaId } },
        })
        await payload.update({
          collection: 'use-cases',
          id: ucId,
          locale: 'id',
          data: { meta: { image: mediaId } },
        })
        results.assigned++
      } catch (err) {
        results.errors.push(`Assign use-case ${ucId}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    return NextResponse.json({
      message: `Uploaded ${results.uploaded} images, assigned to ${results.assigned} items`,
      ...results,
    })
  } catch (error) {
    console.error('Assign OG error:', error)
    return NextResponse.json(
      { error: 'Failed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
