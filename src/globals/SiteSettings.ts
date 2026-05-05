import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'System', hideAPIURL: true },
  fields: [
    { name: 'siteName', type: 'text', localized: true, defaultValue: 'SmartCounter', admin: { description: 'Brand name shown in browser tab and SEO' } },
    { name: 'siteDescription', type: 'textarea', localized: true, admin: { description: 'Short tagline for SEO meta description and social sharing' } },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Main logo used in header and footer' } },
    { name: 'favicon', type: 'upload', relationTo: 'media', admin: { description: 'Small icon shown in browser tab (recommended: 32x32 PNG)' } },
    { name: 'contactEmail', type: 'email', defaultValue: 'info@smartcounter.id', admin: { description: 'Shown in footer and contact page' } },
    { name: 'contactPhone', type: 'text', defaultValue: '+6281234567890', admin: { description: 'Phone number with country code' } },
    { name: 'contactAddress', type: 'textarea', localized: true, admin: { description: 'Office address shown in footer' } },
    { name: 'whatsappNumber', type: 'text', defaultValue: '6281234567890', admin: { description: 'WhatsApp number without + (used for floating chat button)' } },
    {
      name: 'socialLinks',
      type: 'group',
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
