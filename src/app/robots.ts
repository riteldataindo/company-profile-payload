import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartcounter.id'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // Search/index crawlers
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/admin/', '/api/'] },
      // Model-training crawlers
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
