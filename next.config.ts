import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "base-uri 'self'; frame-ancestors 'self'; object-src 'none'",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/brand/**',
      },
      {
        pathname: '/editorial/**',
      },
      {
        pathname: '/illustrations/**',
      },
      {
        pathname: '/media/**',
      },
      {
        pathname: '/og/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/favicon.ico', destination: '/favicon.svg', permanent: false },
      // WordPress blog posts → matching Indonesian blog posts (permanent)
      { source: '/apa-itu-people-counting-system', destination: '/id', permanent: true },
      { source: '/apa-itu-people-counting-system/', destination: '/id', permanent: true },
      { source: '/cara-kerja-people-counting-cctv-ai', destination: '/id', permanent: true },
      { source: '/cara-kerja-people-counting-cctv-ai/', destination: '/id', permanent: true },
      { source: '/manfaat-visitor-counter-toko-retail', destination: '/id', permanent: true },
      { source: '/manfaat-visitor-counter-toko-retail/', destination: '/id', permanent: true },
      { source: '/cctv-ai-people-counting-visitor-analytics', destination: '/id', permanent: true },
      { source: '/cctv-ai-people-counting-visitor-analytics/', destination: '/id', permanent: true },
      // WordPress pages → Next.js pages (ID locale)
      { source: '/fitur', destination: '/id/features', permanent: true },
      { source: '/fitur/', destination: '/id/features', permanent: true },
      { source: '/paket', destination: '/id/contact', permanent: true },
      { source: '/paket/', destination: '/id/contact', permanent: true },
      { source: '/use-case', destination: '/id/use-cases', permanent: true },
      { source: '/use-case/', destination: '/id/use-cases', permanent: true },
      { source: '/faq', destination: '/id/faq', permanent: true },
      { source: '/faq/', destination: '/id/faq', permanent: true },
      { source: '/demo', destination: '/id/demo', permanent: true },
      { source: '/demo/', destination: '/id/demo', permanent: true },
      { source: '/contact', destination: '/id/contact', permanent: true },
      { source: '/contact/', destination: '/id/contact', permanent: true },
      { source: '/about', destination: '/id/contact', permanent: true },
      { source: '/about/', destination: '/id/contact', permanent: true },
      { source: '/blog', destination: '/id', permanent: true },
      { source: '/blog/', destination: '/id', permanent: true },
      { source: '/news-2', destination: '/id', permanent: true },
      { source: '/news-2/', destination: '/id', permanent: true },
      { source: '/sample-page', destination: '/id', permanent: true },
      { source: '/sample-page/', destination: '/id', permanent: true },
    ]
  },
}

export default withPayload(nextConfig)
