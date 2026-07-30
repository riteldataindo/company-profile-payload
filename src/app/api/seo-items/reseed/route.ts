import { NextResponse } from 'next/server'
import { authorizeAdminRequest } from '@/lib/admin-auth'

const FEATURES_EN = [
  { id: 1, slug: 'visitor-traffic', name: 'Visitor Traffic', shortDescription: 'Track every visitor entering and leaving your store with AI-powered CCTV analytics — real-time counting with 99.9% accuracy.' },
  { id: 2, slug: 'in-out-traffic', name: 'In/Out Traffic', shortDescription: 'Separate entry and exit counts across all entrances for net visitor calculations.' },
  { id: 3, slug: 'dwell-time', name: 'Dwell Time', shortDescription: 'Measure how long visitors spend in specific zones — identify engagement hotspots and dead areas.' },
  { id: 4, slug: 'passers-by', name: 'Passers-By', shortDescription: 'Count people walking past your store versus those who enter — measure storefront attraction rate.' },
  { id: 5, slug: 'entering-rate', name: 'Entering Rate', shortDescription: 'Calculate the percentage of passers-by who enter your store — optimize window displays and signage.' },
  { id: 6, slug: 'group-rate', name: 'Group Rate', shortDescription: 'Detect visitor groups versus individuals — understand shopping behavior patterns.' },
  { id: 7, slug: 'demographic', name: 'Demographic', shortDescription: 'Privacy-compliant age and gender estimation — no personal data stored, 100% regulation compliant.' },
  { id: 8, slug: 'occupancy', name: 'Occupancy', shortDescription: 'Real-time occupancy monitoring with configurable thresholds and alerts for safety compliance.' },
  { id: 9, slug: 'service-efficiency', name: 'Service Efficiency', shortDescription: 'Combine visitor traffic with staff presence to measure and optimize service levels.' },
  { id: 10, slug: 'heatmap', name: 'Heatmap', shortDescription: 'Visualize visitor movement patterns across your store — identify hot zones and optimize product placement.' },
  { id: 11, slug: 'queuing', name: 'Queuing', shortDescription: 'Real-time queue length monitoring and wait time estimation — trigger alerts before queues get too long.' },
  { id: 12, slug: 'in-store-routes', name: 'In-Store Routes', shortDescription: 'Track the most common paths visitors take through your store — optimize layout for conversion.' },
]

const FEATURES_ID_SLUGS: Record<string, string> = {
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

const USECASES_EN = [
  { id: 1, slug: 'retail', industryName: 'Retail Store', shortDescription: 'Optimize every store location with visitor analytics — track conversion rates, occupancy, and staffing efficiency.' },
  { id: 2, slug: 'mall', industryName: 'Shopping Mall', shortDescription: 'Mall-wide traffic analytics for tenant benchmarking, zone optimization, and revenue-based leasing.' },
  { id: 3, slug: 'fashion', industryName: 'Fashion Retail', shortDescription: 'Fitting room conversion tracking, collection performance analysis, and seasonal traffic patterns.' },
  { id: 4, slug: 'pharmacy', industryName: 'Pharmacy', shortDescription: 'Prescription counter queue monitoring, pharmacist scheduling optimization, and consultation area tracking.' },
  { id: 5, slug: 'supermarket', industryName: 'Supermarket', shortDescription: 'Aisle-level traffic heatmaps, checkout queue management, and self-checkout adoption tracking.' },
  { id: 6, slug: 'luxury', industryName: 'Luxury Retail', shortDescription: 'Privacy-first demographic insights and VIP traffic pattern analysis for premium retail.' },
]

const USECASES_ID_SLUGS: Record<string, string> = {
  'retail': 'toko-retail',
  'mall': 'pusat-perbelanjaan',
  'fashion': 'fashion',
  'pharmacy': 'apotek',
  'supermarket': 'supermarket',
  'luxury': 'retail-mewah',
}

const LEXICAL_PLACEHOLDER = {
  root: {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Content placeholder.', version: 1 }], version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
}

const BLOGS_EN = [
  { id: 1, slug: 'people-counting-retail-sales', title: 'How People Counting Drives Retail Sales by 25%+', excerpt: 'Real-time visitor analytics help retailers optimize layout, staffing, and marketing ROI. See the data-driven results.' },
  { id: 2, slug: 'mall-tenant-benchmarking', title: 'Mall Tenant Benchmarking: Using CCTV AI for Fair Traffic Allocation', excerpt: 'How shopping malls use SmartCounter to objectively measure tenant traffic and settle occupancy disputes.' },
  { id: 3, slug: 'fashion-fitting-room-conversion', title: 'Fashion Retail: Fitting Room Conversion Tracking with AI', excerpt: 'How AI-powered analytics track conversion rates from browsing to fitting room to purchase in fashion retail.' },
  { id: 4, slug: 'privacy-compliant-demographics', title: 'Privacy-First Demographic Insights: What CCTV AI Can Tell About Customers', excerpt: 'How CCTV AI provides valuable demographic data — age, gender, group size — without storing personal information.' },
  { id: 5, slug: 'queue-management-checkout', title: 'Reduce Checkout Wait Times: Real-Time Queue Management', excerpt: 'AI-powered queue detection can cut checkout wait times by 40-60% with real-time monitoring and smart staffing alerts.' },
  { id: 6, slug: 'occupancy-safety-compliance', title: 'Occupancy Monitoring for Safety & Compliance: Beyond Manual Counts', excerpt: 'Real-time occupancy monitoring ensures safety compliance, fire code adherence, and crowd management with AI accuracy.' },
  { id: 9, slug: 'conversion-rate-retail', title: 'Understanding Conversion Rate in Physical Retail', excerpt: 'What conversion rate means for physical stores, how to measure it, and proven strategies to improve it.' },
  { id: 10, slug: 'apa-itu-people-counting-system', title: 'Apa Itu People Counting System? Panduan Lengkap 2026', excerpt: 'People counting system adalah teknologi penghitung pengunjung berbasis CCTV AI yang membantu bisnis retail menganalisis lalu lintas toko secara real-time dan akurat.' },
  { id: 11, slug: 'cara-kerja-people-counting-cctv-ai', title: 'Cara Kerja People Counting dengan CCTV AI', excerpt: 'Pelajari bagaimana teknologi CCTV AI menghitung pengunjung secara otomatis menggunakan computer vision dan deep learning — akurat hingga 99,9% tanpa hardware tambahan.' },
  { id: 12, slug: 'manfaat-visitor-counter-toko-retail', title: 'Manfaat Visitor Counter untuk Toko Retail Indonesia', excerpt: 'Visitor counter membantu toko retail meningkatkan penjualan hingga 25% dengan data pengunjung akurat untuk optimasi staf, layout toko, dan evaluasi promosi.' },
  { id: 13, slug: 'cctv-ai-people-counting-visitor-analytics', title: 'CCTV AI untuk People Counting dan Visitor Analytics', excerpt: 'Ubah CCTV biasa menjadi sistem analitik pengunjung cerdas dengan AI — hitung traffic, analisis demografi, dan pantau okupansi secara real-time tanpa hardware baru.' },
]

const BLOGS_ID_SLUGS: Record<string, string> = {
  'people-counting-retail-sales': 'people-counting-penjualan-retail',
  'mall-tenant-benchmarking': 'benchmarking-tenant-mall',
  'fashion-fitting-room-conversion': 'konversi-fitting-room-fashion',
  'privacy-compliant-demographics': 'demografi-sesuai-privasi',
  'queue-management-checkout': 'manajemen-antrian-kasir',
  'occupancy-safety-compliance': 'okupansi-keamanan-kepatuhan',
  'conversion-rate-retail': 'tingkat-konversi-retail',
  'apa-itu-people-counting-system': 'apa-itu-people-counting-system',
  'cara-kerja-people-counting-cctv-ai': 'cara-kerja-people-counting-cctv-ai',
  'manfaat-visitor-counter-toko-retail': 'manfaat-visitor-counter-toko-retail',
  'cctv-ai-people-counting-visitor-analytics': 'cctv-ai-people-counting-visitor-analytics',
}

export async function POST(request: Request) {
  try {
    const authorization = await authorizeAdminRequest(request, 'write')
    if (!authorization.ok) return authorization.response
    const { payload } = authorization
    const results = { features: 0, useCases: 0, blogPosts: 0, idSlugs: 0, errors: [] as string[] }

    // Re-seed features EN
    for (const f of FEATURES_EN) {
      try {
        await payload.update({
          collection: 'features',
          id: f.id,
          locale: 'en',
          data: { name: f.name, slug: f.slug, shortDescription: f.shortDescription },
        })
        results.features++
      } catch (err) {
        results.errors.push(`Feature EN ${f.slug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Seed features ID slugs
    for (const f of FEATURES_EN) {
      const idSlug = FEATURES_ID_SLUGS[f.slug]
      if (!idSlug) continue
      try {
        await payload.update({
          collection: 'features',
          id: f.id,
          locale: 'id',
          data: { slug: idSlug, name: f.name, shortDescription: f.shortDescription },
        })
        results.idSlugs++
      } catch (err) {
        results.errors.push(`Feature ID ${f.slug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Re-seed use cases EN
    for (const uc of USECASES_EN) {
      try {
        await payload.update({
          collection: 'use-cases',
          id: uc.id,
          locale: 'en',
          data: { industryName: uc.industryName, slug: uc.slug, shortDescription: uc.shortDescription },
        })
        results.useCases++
      } catch (err) {
        results.errors.push(`UseCase EN ${uc.slug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Seed use cases ID slugs
    for (const uc of USECASES_EN) {
      const idSlug = USECASES_ID_SLUGS[uc.slug]
      if (!idSlug) continue
      try {
        await payload.update({
          collection: 'use-cases',
          id: uc.id,
          locale: 'id',
          data: { slug: idSlug, industryName: uc.industryName, shortDescription: uc.shortDescription },
        })
        results.idSlugs++
      } catch (err) {
        results.errors.push(`UseCase ID ${uc.slug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Re-seed blog posts EN (include content to satisfy required field)
    for (const b of BLOGS_EN) {
      try {
        const existing = await payload.findByID({ collection: 'blog-posts', id: b.id, locale: 'en' }).catch(() => null)
        const data: Record<string, unknown> = { title: b.title, slug: b.slug, excerpt: b.excerpt }
        if (!existing?.content) {
          data.content = LEXICAL_PLACEHOLDER
        }
        await payload.update({
          collection: 'blog-posts',
          id: b.id,
          locale: 'en',
          data,
        })
        results.blogPosts++
      } catch (err) {
        results.errors.push(`Blog EN ${b.slug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    // Seed blog posts ID slugs (always include content for locale)
    for (const b of BLOGS_EN) {
      const idSlug = BLOGS_ID_SLUGS[b.slug]
      if (!idSlug) continue
      try {
        await payload.update({
          collection: 'blog-posts',
          id: b.id,
          locale: 'id',
          data: { slug: idSlug, title: b.title, excerpt: b.excerpt, content: LEXICAL_PLACEHOLDER },
        })
        results.idSlugs++
      } catch (err) {
        results.errors.push(`Blog ID ${b.slug}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    return NextResponse.json({
      message: 'Re-seed completed',
      updated: {
        featuresEN: results.features,
        useCasesEN: results.useCases,
        blogPostsEN: results.blogPosts,
        idSlugsTotal: results.idSlugs,
      },
      errors: results.errors,
    })
  } catch (error) {
    console.error('Reseed error:', error)
    return NextResponse.json(
      { error: 'Failed to reseed', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
