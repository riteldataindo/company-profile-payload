'use client'

import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/sections/ScrollReveal'

const blogPosts = [
  {
    id: 1,
    slug: 'people-counting-retail-sales',
    title: 'How People Counting Drives Retail Sales by 25%+',
    excerpt:
      'Real-time visitor analytics help retailers optimize layout, staffing, and marketing ROI. See the data-driven results.',
    category: 'Analytics',
    author: 'Sarah Chen',
    date: '2026-04-15',
    featured: true,
    readTime: 8,
  },
  {
    id: 2,
    slug: 'mall-tenant-benchmarking',
    title: 'Mall Tenant Benchmarking: Using CCTV AI for Fair Traffic Allocation',
    excerpt:
      'How shopping malls use SmartCounter to objectively measure tenant traffic and settle occupancy disputes.',
    category: 'Use Cases',
    author: 'Marcus Lee',
    date: '2026-04-10',
    featured: false,
    readTime: 6,
  },
  {
    id: 3,
    slug: 'fashion-fitting-room-conversion',
    title: 'Fashion Retail: Fitting Room Conversion Tracking with AI',
    excerpt:
      'Measure which collections drive fitting room visits and understand the path from browsing to trial to purchase.',
    category: 'Analytics',
    author: 'Elena Rodriguez',
    date: '2026-04-05',
    featured: false,
    readTime: 7,
  },
  {
    id: 4,
    slug: 'privacy-compliant-demographics',
    title: 'Privacy-First Demographic Insights: What CCTV AI Can Tell About Customers',
    excerpt:
      'Understand your customer base without collecting personal data. How SmartCounter estimates demographics responsibly.',
    category: 'Technical',
    author: 'Rahul Patel',
    date: '2026-03-30',
    featured: false,
    readTime: 9,
  },
  {
    id: 5,
    slug: 'queue-management-checkout',
    title: 'Reduce Checkout Wait Times: Real-Time Queue Management',
    excerpt:
      'AI-powered queue detection helps retailers prevent abandonments and improve customer satisfaction in real-time.',
    category: 'Features',
    author: 'Jennifer Park',
    date: '2026-03-25',
    featured: false,
    readTime: 5,
  },
  {
    id: 6,
    slug: 'occupancy-safety-compliance',
    title: 'Occupancy Monitoring for Safety & Compliance: Beyond Manual Counts',
    excerpt:
      'CCTV-based real-time occupancy tracking for COVID safety, fire code compliance, and event capacity management.',
    category: 'Compliance',
    author: 'Dr. Ahmad Hassan',
    date: '2026-03-20',
    featured: false,
    readTime: 6,
  },
]

function BlogClient({ locale }: { locale: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ['All', ...new Set(blogPosts.map((p) => p.category))]

  const filteredPosts =
    selectedCategory === 'All' || selectedCategory === null
      ? blogPosts
      : blogPosts.filter((p) => p.category === selectedCategory)

  const featuredPost = blogPosts.find((p) => p.featured)
  const regularPosts = filteredPosts.filter((p) => !p.featured || selectedCategory)

  return (
    <>
      {/* Header */}
      <div className="mb-16 text-center px-4">
        <ScrollReveal>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            SmartCounter Blog
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Latest insights on people counting, CCTV analytics, and retail intelligence.
          </p>
        </ScrollReveal>
      </div>

      {/* Featured Post */}
      {!selectedCategory && featuredPost && (
        <div className="mb-16 px-4">
          <ScrollReveal>
            <Link
              href={`/${locale}/blog/${featuredPost.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl transition-all duration-250 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
            >
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary-500/20 to-primary-500/5 text-center px-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{featuredPost.title}</h3>
                  <p className="text-text-secondary">{featuredPost.excerpt}</p>
                </div>
              </div>
              <div className="flex flex-col border border-t-0 border-white/[0.06] bg-bg-card/60 p-6 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-4 text-sm text-text-secondary">
                  <span className="inline-block rounded-full bg-primary-500/10 px-3 py-1 font-semibold text-primary-400">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(featuredPost.date).toLocaleDateString()}
                  </span>
                  <span>{featuredPost.readTime} min read</span>
                </div>
                <p className="text-sm text-text-muted flex items-center gap-1">
                  <User size={14} /> By {featuredPost.author}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-12 flex flex-wrap gap-2 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-250 ${
              (selectedCategory === null && cat === 'All') || selectedCategory === cat
                ? 'bg-primary-600 text-white'
                : 'border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:border-primary-500/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="px-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        {regularPosts.map((post, i) => (
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
                <p className="mb-3 flex-1 line-clamp-2 text-sm leading-relaxed text-text-secondary">{post.excerpt}</p>
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
    </>
  )
}

async function BlogPageContent({ locale }: { locale: string }) {
  const dict = await getDictionary(locale as Locale)

  return (
    <section className="px-0 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <BlogClient locale={locale} />
      </div>
    </section>
  )
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  return <BlogPageContent locale={locale} />
}
