import Link from 'next/link'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo/metadata'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { SocialShareButtons } from '@/components/blog/SocialShareButtons'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { getBlogPost, blogPosts } from '@/lib/blog-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return buildMetadata({
      title: 'Blog Post',
      description: 'SmartCounter Blog',
      locale,
      path: `/blog/${slug}`,
      ogType: 'article',
    })
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    locale,
    path: `/blog/${slug}`,
    ogType: 'article',
    publishedTime: post.date,
    authors: [post.author],
  })
}

export async function generateStaticParams() {
  return blogPosts.flatMap((post) => [
    { locale: 'en', slug: post.slug },
    { locale: 'id', slug: post.slug },
  ])
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  if (!isValidLocale(locale)) notFound()

  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <ReadingProgressBar />
      <div className="min-h-screen pt-32 pb-20 px-4">
        <JsonLd
          data={blogPostingSchema({
            title: post.title,
            excerpt: post.excerpt,
            slug,
            locale,
            author: post.author,
            datePublished: post.date,
          })}
        />
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', url: `/${locale}` },
            { name: 'Blog', url: `/${locale}/blog` },
            { name: post.title, url: `/${locale}/blog/${slug}` },
          ])}
        />

        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main Article */}
          <article className="max-w-3xl">
            <div className="mb-8">
              <span className="inline-block bg-primary-500/10 text-primary-400 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-4">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                {new Date(post.date).toLocaleDateString()} · {post.readTime} min read
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-text-secondary text-lg">{post.excerpt}</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-semibold text-text-muted">
                  {post.author
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold">{post.author}</div>
                  <div className="text-xs text-text-muted">{new Date(post.date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="aspect-[16/8] rounded-2xl bg-bg-card border border-white/[0.06] flex items-center justify-center text-sm text-text-muted mb-10">
              [Featured Image]
            </div>

            {/* Article Content with Section IDs */}
            <div className="space-y-5">
              {post.content.map((paragraph, i) => {
                // Find matching section for this paragraph
                const matchingSection = post.sections?.find((s) =>
                  paragraph.includes(s.title)
                )

                if (matchingSection) {
                  return (
                    <div key={i} id={matchingSection.id}>
                      <p className="text-text-secondary leading-relaxed font-semibold text-lg pt-4">
                        {paragraph}
                      </p>
                    </div>
                  )
                }

                return (
                  <p key={i} className="text-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* Social Share */}
            <div className="border-t border-white/[0.06] mt-10 pt-8">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Share this article</h3>
              <SocialShareButtons title={post.title} slug={slug} locale={locale} />
            </div>

            {/* Author Bio */}
            <div className="mt-8 rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-6 flex gap-4">
              <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center text-sm font-bold text-text-muted shrink-0">
                {post.author
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </div>
              <div>
                <h4 className="font-semibold mb-1">{post.author}</h4>
                <p className="text-sm text-text-secondary">
                  The product and analytics team at PT Ritel Data Indonesia.
                </p>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <RelatedPosts currentSlug={slug} locale={locale} />
            </div>

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-6 py-3 text-sm font-semibold text-primary-500 transition-all hover:bg-primary-600/10"
              >
                Back to Blog
              </Link>
            </div>
          </article>

          {/* Table of Contents Sidebar */}
          <TableOfContents post={post} />
        </div>
      </div>
    </>
  )
}
