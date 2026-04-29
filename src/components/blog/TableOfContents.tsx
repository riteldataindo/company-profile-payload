'use client'

import { useEffect, useState } from 'react'
import type { BlogPost } from '@/lib/blog-data'

interface TableOfContentsProps {
  post: BlogPost
}

export function TableOfContents({ post }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    // Observe all sections
    if (post.sections) {
      post.sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (element) {
          observer.observe(element)
        }
      })
    }

    return () => observer.disconnect()
  }, [post.sections])

  if (!post.sections || post.sections.length === 0) {
    return null
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky top-20 hidden lg:block">
      <div className="rounded-2xl border border-white/[0.06] bg-bg-card/60 backdrop-blur-xl p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Table of Contents</h3>
        <nav className="space-y-2">
          {post.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                activeId === section.id
                  ? 'bg-primary-500/20 text-primary-400 font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-primary-500/10'
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
