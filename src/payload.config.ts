import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateSeoSuggestion, extractRichText } from '@/lib/seo/suggest'

import { BlogPosts } from '@/collections/BlogPosts'
import { BlogCategories } from '@/collections/BlogCategories'
import { Features } from '@/collections/Features'
import { UseCases } from '@/collections/UseCases'
import { PricingTiers } from '@/collections/PricingTiers'
import { FaqItems } from '@/collections/FaqItems'
import { FormSubmissions } from '@/collections/FormSubmissions'
import { DeploymentLocations } from '@/collections/DeploymentLocations'
import { ClientLogos } from '@/collections/ClientLogos'
import { Media } from '@/collections/Media'
import { Users } from '@/collections/Users'
import { Claims } from '@/collections/Claims'

import { SiteSettings } from '@/globals/SiteSettings'
import { sanitizePublicClaim } from '@/lib/claims'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const payloadSecret = process.env.PAYLOAD_SECRET

if (!payloadSecret) {
  throw new Error('PAYLOAD_SECRET is required; refusing to start with an insecure fallback')
}

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
      actions: ['/admin/components/TopbarActions'],
      providers: ['/admin/components/CmdPaletteProvider'],
      beforeDashboard: ['/admin/components/DashboardOverview'],
      afterNavLinks: ['/admin/components/SeoNavLink'],
      views: {
        seoManagement: {
          Component: '/admin/views/SeoManagementPage',
          path: '/seo-management',
          exact: true,
        },
      },
    },
  },
  collections: [
    BlogPosts,
    BlogCategories,
    Features,
    UseCases,
    PricingTiers,
    FaqItems,
    FormSubmissions,
    DeploymentLocations,
    ClientLogos,
    Media,
    Claims,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: payloadSecret,
  upload: {
    abortOnLimit: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
    preserveExtension: true,
    responseOnLimit: 'Media files must be 10 MB or smaller',
    safeFileNames: true,
  },
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
      collections: ['blog-posts', 'features', 'use-cases'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const name = doc?.title || doc?.name || doc?.industryName || 'SmartCounter'
        const excerpt = doc?.excerpt || doc?.shortDescription || ''
        const fullContent = extractRichText(doc?.content || doc?.longDescription)
        const result = generateSeoSuggestion({ name, excerpt, fullContent })
        return sanitizePublicClaim(result.title)
      },
      generateDescription: ({ doc }) => {
        const name = doc?.title || doc?.name || doc?.industryName || ''
        const excerpt = doc?.excerpt || doc?.shortDescription || ''
        const fullContent = extractRichText(doc?.content || doc?.longDescription)
        const result = generateSeoSuggestion({ name, excerpt, fullContent })
        return sanitizePublicClaim(result.description)
      },
    }),
  ],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Indonesia', code: 'id' },
    ],
    defaultLocale: 'en',
    fallback: false,
  },
})
