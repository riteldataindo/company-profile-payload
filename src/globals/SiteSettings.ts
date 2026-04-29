import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'siteName', type: 'text', localized: true, defaultValue: 'SmartCounter' },
    { name: 'siteDescription', type: 'textarea', localized: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    { name: 'contactEmail', type: 'email', defaultValue: 'info@smartcounter.id' },
    { name: 'contactPhone', type: 'text', defaultValue: '+6281234567890' },
    { name: 'contactAddress', type: 'textarea', localized: true },
    { name: 'whatsappNumber', type: 'text', defaultValue: '6281234567890' },
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
    { name: 'googleAnalyticsId', type: 'text' },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
  ],
}
