import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'company', type: 'text' },
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
  ],
}
