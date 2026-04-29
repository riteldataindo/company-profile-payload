import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'
import { blogPosts, getCategories, getBlogPostsByCategory } from '@/lib/blog-data'
import { Calendar, ArrowRight } from 'lucide-react'

const POSTS_PER_PAGE = 6

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return buildMetadata({
    title: `${categoryName} - SmartCounter Blog`,
    description: `Articles about ${categoryName.toLowerCase()} for people counting, CCTV analytics, and retail intelligence.`,
    locale,
    path: `/blog/category/${slug}`,
    ogType: 'website',
  })
}

export async function generateStaticParams() {
  const categories = getCategories()
  return categories.flatMap((category) => {
    const slug = category.toLowerCase().replace(/\s+/g, '-')
    return [
      { locale: 'en', slug },
      { locale: 'id', slug },
    ]
  })
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()

  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const categoryPosts = getBlogPostsByCategory(categoryName)

  if (categoryPosts.length === 0) {
    notFound()
  }

  const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE)

  return (
    <section className="px-0 py-20 md:py-32">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: `/${locale}` },
          { name: 'Blog', url: `/${locale}/blog` },
          { name: categoryName, url: `/${locale}/blog/category/${slug}` },
        ])}
      />

      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-12 px-4 flex items-center gap-2 text-sm text-text-secondary">
          <Link
            href={`/${locale}/blog`}
            className="hover:text-text-primary transition-colors"
          >
            Blog
          </Link>
          <ChevronRight size={16} />
          <span className="text-text-primary font-medium">{categoryName}</span>
        </div>

        {/* Header */}
        <div className="mb-16 text-center px-4">
          <ScrollReveal>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {categoryName}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto max-w-2xl text-lg text-text-secondary">
              {categoryPosts.length} articles in this category
            </p>
          </ScrollReveal>
        </div>

        {/* Blog Grid */}
        <div className="px-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {categoryPosts.slice(0, POSTS_PER_PAGE).map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 50}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
              >
                <div className="flex aspect-video items-center justify-center bg-bg-elevated transition-colors group-hover:bg-bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/15 text-primary-400">
                    📰
                  </div>
                </div>
                <div className="flex flex-1 flex-col border border-t-0 border-white/[0.06] bg-bg-card/60 p-5 backdrop-blur-xl">
                  <span className="mb-2 inline-block rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-400 w-fit">
                    {post.category}
                  </span>
                  <h3 className="mb-2 line-clamp-2 text-base font-semibold">{post.title}</h3>
                  <p className="mb-3 flex-1 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                    {post.excerpt}
                  </p>
                  <div className="mb-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar size={12} /> {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Back to Blog */}
        <div className="px-4 text-center">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-6 py-3 text-sm font-semibold text-primary-500 transition-all hover:bg-primary-600/10"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </section>
  )
}
