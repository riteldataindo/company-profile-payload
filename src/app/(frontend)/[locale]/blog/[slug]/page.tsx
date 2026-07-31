import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale, locales } from '@/lib/i18n/config'
import { notFound, permanentRedirect } from 'next/navigation'
import { buildMetadata } from '@/lib/seo/metadata'
import { blogPostingSchema, breadcrumbSchema } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar'
import { ComparisonTable, VideoEmbed, InlineImage } from '@/components/blog/BlogEnrichment'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { SocialShareButtons } from '@/components/blog/SocialShareButtons'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { LexicalRichText } from '@/components/content/LexicalRichText'
import {
  getBlogPosts as getPayloadBlogPosts,
  getMediaUrl,
  resolveBlogPostRoute,
} from '@/lib/data'
import { extractRichTextHeadings } from '@/lib/richtext'
import {
  canonicalSlugForLocale,
  localizedSectionPaths,
} from '@/lib/localized-routes'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  if (!isValidLocale(locale)) {
    return buildMetadata({
      title: 'Blog Post',
      description: 'SmartCounter Blog',
      locale,
      path: `/blog/${slug}`,
      ogType: 'article',
      noIndex: true,
    })
  }

  const resolution = await resolveBlogPostRoute(slug, locale)
  const post = resolution?.document

  if (!post) {
    return buildMetadata({
      title: 'Blog Post',
      description: 'SmartCounter Blog',
      locale,
      path: `/blog/${slug}`,
      ogType: 'article',
    })
  }

  const meta = (post as any).meta || {}
  const seoTitle = meta.title || post.title
  const seoDesc = meta.description || (post as any).excerpt || ''
  const seoImage = getMediaUrl(meta.image) || getMediaUrl((post as any).featuredImage)
  const authorName = (post as any).author?.name || (post as any).author || ''
  const canonicalSlug = resolution
    ? canonicalSlugForLocale(resolution.slugs, locale) || slug
    : slug

  return buildMetadata({
    title: seoTitle,
    description: seoDesc,
    locale,
    path: `/blog/${canonicalSlug}`,
    ogType: 'article',
    ogImage: seoImage,
    publishedTime: (post as any).publishedAt || (post as any).date || '',
    authors: authorName ? [authorName] : [],
    alternatePaths: resolution
      ? localizedSectionPaths('blog', resolution.slugs)
      : undefined,
  })
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    const result = await getPayloadBlogPosts({ limit: 100, locale })
    for (const post of result.docs) {
      const slug = (post as any).slug
      if (slug) params.push({ locale, slug })
    }
  }
  return params
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  if (!isValidLocale(locale)) notFound()

  const resolution = await resolveBlogPostRoute(slug, locale)
  if (!resolution) notFound()
  const canonicalSlug = canonicalSlugForLocale(resolution.slugs, locale)
  if (!canonicalSlug) notFound()
  if (slug !== canonicalSlug) {
    permanentRedirect(`/${locale}/blog/${canonicalSlug}`)
  }

  const post = resolution.document as any
  const enrichmentSlug = resolution.slugs.en || canonicalSlug

  const dict = await getDictionary(locale as Locale)
  const postDate = post.date || post.publishedAt || new Date().toISOString()
  const postAuthor = typeof post.author === 'object' ? post.author?.name : post.author
  const postCategory = typeof post.category === 'string' ? post.category : post.category?.name
  const contentHeadings = extractRichTextHeadings(post.content)

  return (
    <>
      <ReadingProgressBar />
      <div className="min-h-screen pt-32 pb-20 px-4">
        <JsonLd
          data={blogPostingSchema({
            title: post.title,
            excerpt: post.excerpt || '',
            slug: canonicalSlug,
            locale,
            author: postAuthor || '',
            datePublished: postDate,
            dateModified: post.updatedAt || postDate,
            image: getMediaUrl(post.featuredImage) || getMediaUrl(post.meta?.image),
          })}
        />
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', url: `/${locale}` },
            { name: 'Blog', url: `/${locale}/blog` },
            { name: post.title, url: `/${locale}/blog/${canonicalSlug}` },
          ])}
        />

        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main Article */}
          <article className="max-w-3xl">
            <div className="mb-8">
              <span className="inline-block bg-primary-500/10 text-primary-400 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-4">
                {postCategory}
              </span>
              <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                {new Date(postDate).toLocaleDateString()} · {post.readTime || post.readingTime || 5} min read
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-text-secondary text-lg">{post.excerpt}</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-semibold text-text-muted">
                  {postAuthor
                    ?.split(' ')
                    .map((w: string) => w[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold">{postAuthor}</div>
                  <div className="text-xs text-text-muted">{new Date(postDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {post.featuredImage?.url || post.meta?.image?.url ? (
              <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-white/[0.06] mb-10">
                <Image
                  src={post.featuredImage?.url || post.meta?.image?.url}
                  alt={post.featuredImage?.alt || post.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            ) : (
              <div className="aspect-[16/8] rounded-2xl bg-bg-card border border-white/[0.06] flex items-center justify-center text-sm text-text-muted mb-10">
                [Featured Image]
              </div>
            )}

            {/* CMS-authored Lexical content */}
            <LexicalRichText data={post.content} />

            <InlineImage slug={enrichmentSlug} position="mid" />

            {/* Comparison Table */}
            <ComparisonTable slug={enrichmentSlug} />

            {/* Inline Image — end of article */}
            <InlineImage slug={enrichmentSlug} position="end" />

            {/* Video Embed */}
            <VideoEmbed />

            {/* Social Share */}
            <div className="border-t border-white/[0.06] mt-10 pt-8">
              <h3 className="text-sm font-semibold text-text-primary mb-4">{dict.blogDetail.shareArticle}</h3>
              <SocialShareButtons title={post.title} slug={canonicalSlug} locale={locale} />
            </div>

            {/* Author Bio */}
            <div className="mt-8 rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-6 flex gap-4">
              <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center text-sm font-bold text-text-muted shrink-0">
                {postAuthor
                  ?.split(' ')
                  .map((w: string) => w[0])
                  .join('')}
              </div>
              <div>
                <h4 className="font-semibold mb-1">{postAuthor}</h4>
                <p className="text-sm text-text-secondary">
                  The product and analytics team at PT Ritel Data Indonesia.
                </p>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <RelatedPosts currentSlug={canonicalSlug} locale={locale} />
            </div>

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-6 py-3 text-sm font-semibold text-primary-500 transition-all hover:bg-primary-600/10"
              >
                {dict.blogDetail.backToBlog}
              </Link>
            </div>
          </article>

          {/* Table of Contents Sidebar */}
          <TableOfContents headings={contentHeadings} />
        </div>
      </div>
    </>
  )
}
