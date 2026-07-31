'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'
import { blogPageHref } from '@/lib/blog-routing'

type BlogCategoryOption = {
  id?: string | number
  name: string
  slug: string
}

export function BlogClient({
  locale,
  page,
  category,
  posts = [],
  categories: payloadCategories = [],
  totalPages: payloadTotalPages = 0,
  totalDocs = 0,
  basePath,
  heading = 'SmartCounter Blog',
  subheading = 'Latest insights on people counting, CCTV analytics, and retail intelligence.',
  showCategories = true,
}: {
  locale: string
  page: number
  category: string | null
  posts?: any[]
  categories?: BlogCategoryOption[]
  totalPages?: number
  totalDocs?: number
  basePath?: string
  heading?: string
  subheading?: string
  showCategories?: boolean
}) {
  const currentPage = page
  const selectedCategory = category
  const resolvedBasePath = basePath || `/${locale}/blog`
  const featuredPost = !selectedCategory
    ? posts.find((post: any) => post.featured || post.isFeatured)
    : null
  const totalPages = payloadTotalPages
  const paginatedPosts = posts

  return (
    <>
      <div className="mb-16 text-center px-4">
        <ScrollReveal>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {heading}
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            {subheading}
          </p>
        </ScrollReveal>
      </div>

      {!selectedCategory && featuredPost && (
        <div className="mb-16 px-4">
          <ScrollReveal>
            <Link
              href={`/${locale}/blog/${featuredPost.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary-500/20 to-primary-500/5">
                {featuredPost.featuredImage?.url ? (
                  <Image
                    alt={featuredPost.featuredImage.alt || featuredPost.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    src={featuredPost.featuredImage.url}
                  />
                ) : featuredPost.meta?.image?.url ? (
                  <Image
                    alt={featuredPost.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    src={featuredPost.meta.image.url}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center px-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{featuredPost.title}</h3>
                      <p className="text-text-secondary">{featuredPost.excerpt}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col border border-t-0 border-white/[0.06] bg-bg-card/60 p-6 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-4 text-sm text-text-secondary">
                  <span className="inline-block rounded-full bg-primary-500/10 px-3 py-1 font-semibold text-primary-400">
                    {featuredPost.category?.name || featuredPost.category || 'Article'}
                  </span>
                  <span className="flex items-center gap-1">
                  <Calendar size={14} /> {new Date(featuredPost.publishedAt || featuredPost.date).toLocaleDateString()}
                  </span>
                  <span>{featuredPost.readTime} min read</span>
                </div>
                <p className="text-sm text-text-muted flex items-center gap-1">
                  <User size={14} /> By {typeof featuredPost.author === 'object' ? featuredPost.author?.name : featuredPost.author}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      )}

      {showCategories && (
      <div className="mb-12 flex flex-wrap gap-2 px-4">
        <Link
          href={`/${locale}/blog`}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-250 ${
            selectedCategory === null
              ? 'bg-primary-600 text-white'
              : 'border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:border-primary-500/20'
          }`}
        >
          All
        </Link>
        {payloadCategories.map((categoryOption) => (
          <Link
            key={categoryOption.id || categoryOption.slug}
            href={`/${locale}/blog/category/${categoryOption.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-250 ${
              selectedCategory === categoryOption.slug
                ? 'bg-primary-600 text-white'
                : 'border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:border-primary-500/20'
            }`}
          >
            {categoryOption.name}
          </Link>
        ))}
      </div>
      )}

      {paginatedPosts.length === 0 ? (
        <div className="mx-4 mb-16 rounded-2xl border border-white/[0.06] bg-bg-card/60 px-6 py-14 text-center backdrop-blur-xl">
          <h2 className="mb-2 text-xl font-semibold">No articles found</h2>
          <p className="text-sm text-text-secondary">
            {selectedCategory
              ? 'There are no published articles in this category yet.'
              : 'There are no published articles yet.'}
          </p>
        </div>
      ) : (
      <div className="px-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        {paginatedPosts.map((post: any, i: number) => {
          const postCategory = post.category?.name || post.category
          const postDate = post.publishedAt || post.date
          const postAuthor = typeof post.author === 'object' ? post.author?.name : post.author
          return (
            <ScrollReveal key={post.id || post.slug} delay={i * 50}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
              >
                <div className="relative aspect-video overflow-hidden bg-bg-elevated transition-colors group-hover:bg-bg-card">
                  {post.featuredImage?.url ? (
                    <Image
                      alt={post.featuredImage.alt || post.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={post.featuredImage.url}
                    />
                  ) : post.meta?.image?.url ? (
                    <Image
                      alt={post.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={post.meta.image.url}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/15 text-primary-400 text-lg">B</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col border border-t-0 border-white/[0.06] bg-bg-card/60 p-5 backdrop-blur-xl">
                  <span className="mb-2 inline-block rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-400 w-fit">
                    {postCategory}
                  </span>
                  <h3 className="mb-2 line-clamp-2 text-base font-semibold">{post.title}</h3>
                  <p className="mb-3 flex-1 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                    {post.excerpt}
                  </p>
                  <div className="mb-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar size={12} /> {postDate ? new Date(postDate).toLocaleDateString() : 'N/A'}
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center gap-1">
                        <span>{post.readingTime} min read</span>
                      </div>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          )
        })}
      </div>
      )}

      {totalPages > 1 && (
        <div className="px-4 flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={blogPageHref(resolvedBasePath, currentPage - 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:border-primary-500/20 transition-all"
              >
                <ChevronLeft size={16} />
                <span className="text-sm font-medium">Previous</span>
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={blogPageHref(resolvedBasePath, currentPage + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:border-primary-500/20 transition-all"
              >
                <span className="text-sm font-medium">Next</span>
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
