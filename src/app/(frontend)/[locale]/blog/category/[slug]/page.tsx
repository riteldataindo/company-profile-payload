import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { BlogClient } from '@/components/blog/BlogClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { getBlogCategories, getBlogCategory, getBlogPosts } from '@/lib/data'
import { BLOG_PAGE_SIZE, blogPageHref, parseBlogPage } from '@/lib/blog-routing'
import { isValidLocale, locales } from '@/lib/i18n/config'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}

  const category = await getBlogCategory(slug, locale)
  if (!category) return {}

  return buildMetadata({
    title: `${category.name} — SmartCounter Blog`,
    description: category.description
      || `Articles about ${category.name.toLowerCase()} for people counting, CCTV analytics, and retail intelligence.`,
    locale,
    path: `/blog/category/${category.slug}`,
    ogType: 'website',
  })
}

export async function generateStaticParams() {
  const localizedCategories = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      categories: await getBlogCategories(locale),
    })),
  )

  return localizedCategories.flatMap(({ locale, categories }) => (
    categories.map((category: any) => ({ locale, slug: category.slug }))
  ))
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const parsedPage = parseBlogPage((await searchParams).page)
  const basePath = `/${locale}/blog/category/${slug}`
  if (parsedPage.shouldRedirect) permanentRedirect(basePath)

  const [category, categories] = await Promise.all([
    getBlogCategory(slug, locale),
    getBlogCategories(locale),
  ])
  if (!category) notFound()

  const postsResult = await getBlogPosts({
    page: parsedPage.page,
    limit: BLOG_PAGE_SIZE,
    locale,
    category: category.slug,
  })
  if (!postsResult.categoryFound) notFound()
  if (postsResult.totalPages > 0 && parsedPage.page > postsResult.totalPages) notFound()

  return (
    <section className="px-0 py-20 md:py-32">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: `/${locale}` },
          { name: 'Blog', url: `/${locale}/blog` },
          { name: category.name, url: basePath },
        ])}
      />
      <div className="mx-auto max-w-7xl">
        <BlogClient
          locale={locale}
          page={parsedPage.page}
          category={category.slug}
          posts={postsResult.docs}
          categories={categories}
          totalPages={postsResult.totalPages}
          totalDocs={postsResult.totalDocs}
          basePath={basePath}
          heading={category.name}
          subheading={category.description || `${postsResult.totalDocs} published articles in this category.`}
        />
      </div>
    </section>
  )
}
