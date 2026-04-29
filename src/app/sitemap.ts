import type { MetadataRoute } from 'next'
import { getFeatures, getUseCases, getBlogPosts } from '@/lib/data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcounter.id'
const locales = ['en', 'id', 'ko', 'ja', 'zh']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [features, useCases, blogResult] = await Promise.all([
    getFeatures(),
    getUseCases(),
    getBlogPosts({ limit: 100 }),
  ])

  const entries: MetadataRoute.Sitemap = []

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/features', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/use-cases', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/packages', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/demo', priority: 0.8, changeFrequency: 'monthly' as const },
  ]

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}${page.path}`])
          ),
        },
      })
    }
  }

  for (const feature of features) {
    const slug = (feature as any).slug
    if (!slug) continue
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/features/${slug}`,
        lastModified: (feature as any).updatedAt ? new Date((feature as any).updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  for (const useCase of useCases) {
    const slug = (useCase as any).slug
    if (!slug) continue
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/use-cases/${slug}`,
        lastModified: (useCase as any).updatedAt ? new Date((useCase as any).updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  for (const post of blogResult.docs) {
    const slug = (post as any).slug
    if (!slug) continue
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: (post as any).updatedAt ? new Date((post as any).updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  return entries
}
