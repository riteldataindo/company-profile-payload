import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getRelatedPosts } from '@/lib/blog-data'

interface RelatedPostsProps {
  currentSlug: string
  locale: string
}

export function RelatedPosts({ currentSlug, locale }: RelatedPostsProps) {
  const relatedPosts = getRelatedPosts(currentSlug, 3)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
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
        ))}
      </div>
    </section>
  )
}
