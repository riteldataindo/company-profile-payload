import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { BlogClient } from '@/components/blog/BlogClient'
import { findBlogCategory, getBlogPosts, getBlogCategories } from '@/lib/data'
import { BLOG_PAGE_SIZE, blogPageHref, parseBlogPage } from '@/lib/blog-routing'

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
  searchParams: Promise<{ page?: string | string[]; category?: string | string[] }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const sp = await searchParams
  const parsedPage = parseBlogPage(sp.page)
  if (parsedPage.shouldRedirect) {
    permanentRedirect(`/${locale}/blog`)
  }

  if (typeof sp.category === 'string' && sp.category.trim()) {
    const legacyCategory = await findBlogCategory(sp.category, locale)
    if (!legacyCategory) notFound()
    permanentRedirect(blogPageHref(
      `/${locale}/blog/category/${legacyCategory.slug}`,
      parsedPage.page,
    ))
  }

  // Fetch posts and categories from Payload
  const postsResult = await getBlogPosts({
    page: parsedPage.page,
    limit: BLOG_PAGE_SIZE,
    locale,
  })
  if (postsResult.totalPages > 0 && parsedPage.page > postsResult.totalPages) notFound()

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
          page={parsedPage.page}
          category={null}
          posts={postsResult.docs}
          categories={categories}
          totalPages={postsResult.totalPages}
          totalDocs={postsResult.totalDocs}
          basePath={`/${locale}/blog`}
        />
      </div>
    </section>
  )
}
