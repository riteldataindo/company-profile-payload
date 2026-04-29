import Link from 'next/link'
import type { Metadata } from 'next'

const posts: Record<string, { title: string; category: string; date: string; readTime: string; author: string; excerpt: string; content: string[] }> = {
  '5-metrics-every-retail-manager-should-track': {
    title: '5 Metrics Every Retail Manager Should Track Daily',
    category: 'Retail Analytics', date: 'Apr 20, 2026', readTime: '5 min', author: 'Ritel Data Team',
    excerpt: 'Most retail managers check sales numbers daily but miss the traffic metrics that explain why sales are up or down.',
    content: [
      'If your sales dropped 15% this week, what happened? Was it fewer visitors, or the same traffic with worse conversion? Without traffic data, you can\'t tell.',
      'Sales numbers tell you what happened. Traffic metrics tell you why. Here are the five numbers that separate data-driven retail managers from gut-driven ones.',
      '1. Total Visitor Traffic — The most fundamental metric: how many people walked into your store today? Track it hourly, daily, and weekly.',
      '2. Conversion Rate — Divide POS transactions by visitor count. Most retailers are shocked when they first see this number.',
      '3. Peak Hour Distribution — When are your busiest hours? Not when you think — when the data says.',
      '4. Dwell Time by Zone — How long do visitors spend in different areas of your store?',
      '5. Traffic-to-Staff Ratio — Divide visitor count by staff on floor for each hour.',
    ],
  },
  'heatmap-optimization-guide': {
    title: 'How to Use Heatmap Data to Redesign Your Store Layout',
    category: 'Tips & Tricks', date: 'Apr 18, 2026', readTime: '7 min', author: 'Ayu R.',
    excerpt: 'A practical step-by-step guide to reading heatmap data and translating it into layout changes.',
    content: ['Heatmap data shows you where customers go and where they don\'t. Use this data to optimize product placement, identify dead zones, and improve customer flow.'],
  },
  'conversion-rate-retail': {
    title: 'Understanding Conversion Rate in Physical Retail',
    category: 'Retail Analytics', date: 'Apr 15, 2026', readTime: '4 min', author: 'Ritel Data Team',
    excerpt: 'Online stores track conversion obsessively. Why don\'t physical stores?',
    content: ['Conversion rate in physical retail is simply: transactions divided by foot traffic. Most stores don\'t measure this because they lack accurate people counting.'],
  },
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts[slug]
  return { title: post?.title || 'Blog Post', description: post?.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const post = posts[slug]

  if (!post) {
    return <div className="min-h-screen pt-32 text-center"><h1 className="text-3xl font-bold">Post not found</h1></div>
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <article className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="inline-block bg-primary-500/10 text-primary-400 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-4">{post.category}</span>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-3">{post.date} · {post.readTime} read</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">{post.title}</h1>
          <p className="text-text-secondary text-lg">{post.excerpt}</p>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-semibold text-text-muted">{post.author.split(' ').map(w => w[0]).join('')}</div>
            <div><div className="text-sm font-semibold">{post.author}</div><div className="text-xs text-text-muted">{post.date}</div></div>
          </div>
        </div>

        <div className="aspect-[16/8] rounded-2xl bg-bg-card border border-border-subtle flex items-center justify-center text-sm text-text-muted mb-10">[Featured Image]</div>

        <div className="space-y-5">
          {post.content.map((p, i) => (
            <p key={i} className="text-text-secondary leading-relaxed">{p}</p>
          ))}
        </div>

        <div className="border-t border-border-subtle mt-10 pt-8">
          <h3 className="text-sm font-semibold text-text-muted mb-4">Share this article</h3>
          <div className="flex gap-2">
            {['Twitter', 'LinkedIn', 'WhatsApp', 'Copy Link'].map(s => (
              <button key={s} className="px-3 py-2 rounded-lg border border-border-default text-xs text-text-secondary hover:text-text-primary hover:border-text-muted transition-all">{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-6 flex gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center text-sm font-bold text-text-muted shrink-0">{post.author.split(' ').map(w => w[0]).join('')}</div>
          <div>
            <h4 className="font-semibold mb-1">{post.author}</h4>
            <p className="text-sm text-text-secondary">The product and analytics team at PT Ritel Data Indonesia.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-6 py-3 text-sm font-semibold text-primary-500 transition-all hover:bg-primary-600/10">
            Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}
