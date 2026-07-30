import { NextResponse } from 'next/server'
import { authorizeAdminRequest } from '@/lib/admin-auth'

const FEATURE_SLUGS_ID: Record<string, string> = {
  'visitor-traffic': 'lalu-lintas-pengunjung',
  'in-out-traffic': 'lalu-lintas-masuk-keluar',
  'dwell-time': 'waktu-tinggal',
  'passers-by': 'pejalan-kaki',
  'entering-rate': 'tingkat-masuk',
  'group-rate': 'tingkat-grup',
  'demographic': 'demografi',
  'occupancy': 'okupansi',
  'service-efficiency': 'efisiensi-layanan',
  'heatmap': 'peta-panas',
  'queuing': 'antrian',
  'in-store-routes': 'rute-dalam-toko',
}

const USECASE_SLUGS_ID: Record<string, string> = {
  'retail': 'toko-retail',
  'mall': 'pusat-perbelanjaan',
  'fashion': 'fashion',
  'pharmacy': 'apotek',
  'supermarket': 'supermarket',
  'luxury': 'retail-mewah',
}

const BLOG_SLUGS_ID: Record<string, string> = {
  'people-counting-retail-sales': 'people-counting-penjualan-retail',
  'mall-tenant-benchmarking': 'benchmarking-tenant-mall',
  'fashion-fitting-room-conversion': 'konversi-fitting-room-fashion',
  'privacy-compliant-demographics': 'demografi-sesuai-privasi',
  'queue-management-checkout': 'manajemen-antrian-kasir',
  'occupancy-safety-compliance': 'okupansi-keamanan-kepatuhan',
  '5-metrics-every-retail-manager-should-track': '5-metrik-wajib-manajer-retail',
  'heatmap-optimization-guide': 'panduan-optimasi-heatmap',
  'conversion-rate-retail': 'tingkat-konversi-retail',
}

export async function POST(request: Request) {
  try {
    const authorization = await authorizeAdminRequest(request, 'write')
    if (!authorization.ok) return authorization.response
    const { payload } = authorization
    const results = { features: 0, useCases: 0, blogPosts: 0, errors: [] as string[] }

    // Seed feature slugs for ID locale
    const features = await payload.find({ collection: 'features', limit: 1000, locale: 'en' })
    for (const doc of features.docs) {
      const enSlug = (doc as any).slug
      const idSlug = FEATURE_SLUGS_ID[enSlug]
      if (!idSlug) continue

      try {
        await payload.update({
          collection: 'features',
          id: doc.id,
          locale: 'id',
          data: { slug: idSlug },
        })
        results.features++
      } catch (err) {
        results.errors.push(`Feature ${enSlug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Seed use case slugs for ID locale
    const useCases = await payload.find({ collection: 'use-cases', limit: 1000, locale: 'en' })
    for (const doc of useCases.docs) {
      const enSlug = (doc as any).slug
      const idSlug = USECASE_SLUGS_ID[enSlug]
      if (!idSlug) continue

      try {
        await payload.update({
          collection: 'use-cases',
          id: doc.id,
          locale: 'id',
          data: { slug: idSlug },
        })
        results.useCases++
      } catch (err) {
        results.errors.push(`Use case ${enSlug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Seed blog post slugs for ID locale
    const blogPosts = await payload.find({ collection: 'blog-posts', limit: 1000, locale: 'en' })
    for (const doc of blogPosts.docs) {
      const enSlug = (doc as any).slug
      const idSlug = BLOG_SLUGS_ID[enSlug]
      if (!idSlug) continue

      try {
        await payload.update({
          collection: 'blog-posts',
          id: doc.id,
          locale: 'id',
          data: { slug: idSlug },
        })
        results.blogPosts++
      } catch (err) {
        results.errors.push(`Blog ${enSlug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    return NextResponse.json({
      message: 'Indonesian slugs seeded successfully',
      updated: {
        features: results.features,
        useCases: results.useCases,
        blogPosts: results.blogPosts,
      },
      errors: results.errors,
    })
  } catch (error) {
    console.error('Seed ID slugs error:', error)
    return NextResponse.json(
      { error: 'Failed to seed Indonesian slugs', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
