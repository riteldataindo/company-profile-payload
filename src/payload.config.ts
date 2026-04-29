import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Pages } from '@/collections/Pages'
import { BlogPosts } from '@/collections/BlogPosts'
import { BlogCategories } from '@/collections/BlogCategories'
import { Features } from '@/collections/Features'
import { UseCases } from '@/collections/UseCases'
import { PricingTiers } from '@/collections/PricingTiers'
import { FaqItems } from '@/collections/FaqItems'
import { ClientLogos } from '@/collections/ClientLogos'
import { FormSubmissions } from '@/collections/FormSubmissions'
import { DeploymentLocations } from '@/collections/DeploymentLocations'
import { Media } from '@/collections/Media'
import { Users } from '@/collections/Users'

import { SiteSettings } from '@/globals/SiteSettings'
import { Navigation } from '@/globals/Navigation'
import { Homepage } from '@/globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/admin/components/Logo',
        Icon: '/admin/components/Icon',
      },
      beforeDashboard: ['/admin/components/DashboardOverview'],
    },
    style: path.resolve(dirname, 'admin/custom.css'),
  },
  collections: [
    Pages,
    BlogPosts,
    BlogCategories,
    Features,
    UseCases,
    PricingTiers,
    FaqItems,
    ClientLogos,
    FormSubmissions,
    DeploymentLocations,
    Media,
    Users,
  ],
  globals: [SiteSettings, Navigation, Homepage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'default-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages', 'blog-posts', 'features', 'use-cases'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc?.title || 'SmartCounter'} — AI People Counting`,
      generateDescription: ({ doc }) => doc?.excerpt || doc?.shortDescription || '',
    }),
  ],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Indonesia', code: 'id' },
      { label: '한국어', code: 'ko' },
      { label: '日本語', code: 'ja' },
      { label: '中文', code: 'zh' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
})
