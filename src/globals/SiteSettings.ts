import type { GlobalConfig } from 'payload'
import { canManageContent, publicRead, verifiedIdentityField } from '@/access/admin'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: publicRead,
    update: canManageContent,
  },
  label: 'Site Settings',
  admin: { group: 'System', hideAPIURL: true },
  fields: [
    { name: 'siteName', type: 'text', localized: true, defaultValue: 'SmartCounter', admin: { description: 'Brand name shown in browser tab and SEO' } },
    { name: 'siteDescription', type: 'textarea', localized: true, admin: { description: 'Short tagline for SEO meta description and social sharing' } },
    { name: 'identityVerified', type: 'checkbox', defaultValue: false, admin: { description: 'Enable public company/contact proof only after owner review.' } },
    { name: 'legalName', type: 'text', access: { read: verifiedIdentityField } },
    { name: 'productOperator', type: 'text', access: { read: verifiedIdentityField } },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Main logo used in header and footer' } },
    { name: 'favicon', type: 'upload', relationTo: 'media', admin: { description: 'Small icon shown in browser tab (recommended: 32x32 PNG)' } },
    { name: 'contactEmail', type: 'email', access: { read: verifiedIdentityField }, admin: { description: 'Shown only after identity/contact review.' } },
    { name: 'contactPhone', type: 'text', access: { read: verifiedIdentityField }, admin: { description: 'Phone number with country code.' } },
    { name: 'contactAddress', type: 'textarea', localized: true, access: { read: verifiedIdentityField }, admin: { description: 'Office address shown in footer' } },
    { name: 'supportHours', type: 'text', localized: true, access: { read: verifiedIdentityField } },
    { name: 'responseExpectation', type: 'text', localized: true, access: { read: verifiedIdentityField } },
    { name: 'whatsappNumber', type: 'text', access: { read: verifiedIdentityField }, admin: { description: 'Verified WhatsApp number without +.' } },
    { name: 'formPrivacyUrl', type: 'text', defaultValue: '/privacy' },
    {
      name: 'socialLinks',
      type: 'group',
      access: { read: verifiedIdentityField },
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'tiktok', type: 'text' },
      ],
    },
    { name: 'googleAnalyticsId', type: 'text', admin: { description: 'Google Analytics tracking ID (e.g. G-XXXXXXXXXX)' } },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media', admin: { description: 'Default image for social media sharing (recommended: 1200x630)' } },
  ],
}
