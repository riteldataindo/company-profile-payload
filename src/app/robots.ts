import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  if (!siteUrl) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  const inactiveLocalePaths = ['/ko', '/ja', '/zh']
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', ...inactiveLocalePaths],
      },
      // Search/index crawlers
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/admin/', '/api/', ...inactiveLocalePaths] },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: ['/admin/', '/api/', ...inactiveLocalePaths] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/admin/', '/api/', ...inactiveLocalePaths] },
      // Model-training crawlers
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  }
}
