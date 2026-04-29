'use client'

import { useState } from 'react'
import { Share2, MessageCircle, Link as LinkIcon } from 'lucide-react'

interface SocialShareButtonsProps {
  title: string
  slug: string
  locale: string
}

export function SocialShareButtons({ title, slug, locale }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const baseUrl = 'https://smartcounter.id'
  const postUrl = `${baseUrl}/${locale}/blog/${slug}`
  const encodedUrl = encodeURIComponent(postUrl)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:text-text-primary hover:border-primary-500/20 transition-all"
        title="Share on Twitter/X"
      >
        <Share2 size={16} />
        <span className="text-sm font-medium">X</span>
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:text-text-primary hover:border-primary-500/20 transition-all"
        title="Share on LinkedIn"
      >
        <Share2 size={16} />
        <span className="text-sm font-medium">LinkedIn</span>
      </a>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:text-text-primary hover:border-primary-500/20 transition-all"
        title="Share on WhatsApp"
      >
        <MessageCircle size={16} />
        <span className="text-sm font-medium">WhatsApp</span>
      </a>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.06] bg-bg-card/60 text-text-secondary hover:text-text-primary hover:border-primary-500/20 transition-all"
        title="Copy link to clipboard"
      >
        <LinkIcon size={16} />
        <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  )
}
