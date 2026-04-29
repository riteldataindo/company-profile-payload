import type { CollectionConfig } from 'payload'

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  admin: { useAsTitle: 'companyName' },
  fields: [
    { name: 'companyName', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'websiteUrl', type: 'text' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
  ],
}
