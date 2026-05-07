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
      // AI search crawlers — explicitly allowed for GEO visibility
      { userAgent: 'GPTBot', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/admin/', '/api/'] },
      { userAgent: 'Bytespider', allow: '/', disallow: ['/admin/', '/api/'] },
      // Block training-only crawlers
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
