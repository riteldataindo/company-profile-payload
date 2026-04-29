import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { BlogClient } from '@/components/blog/BlogClient'
import { getBlogPosts, getBlogCategories } from '@/lib/data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    title: 'Blog — People Counting & Retail Analytics Insights',
    description: 'Latest insights on people counting, CCTV analytics, and retail intelligence from SmartCounter.',
    locale,
    path: '/blog',
  })
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const sp = await searchParams
  const page = parseInt(sp.page || '1')
  const category = sp.category || null

  // Fetch posts and categories from Payload
  const postsResult = await getBlogPosts({
    page,
    limit: 6,
    locale,
    category: category || undefined,
  })

  const categories = await getBlogCategories(locale)

  return (
    <section className="px-0 py-20 md:py-32">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: `/${locale}` },
          { name: 'Blog', url: `/${locale}/blog` },
        ])}
      />
      <div className="mx-auto max-w-7xl">
        <BlogClient
          locale={locale}
          page={page}
          category={category}
          posts={postsResult.docs}
          categories={categories}
          totalPages={postsResult.totalPages}
          totalDocs={postsResult.totalDocs}
        />
      </div>
    </section>
  )
}
