import type { CollectionConfig } from 'payload'

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  admin: { useAsTitle: 'question' },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    { name: 'answer', type: 'richText', required: true, localized: true },
    { name: 'category', type: 'text', localized: true, admin: { description: 'e.g. general, installation, analytics, pricing, technical' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
  ],
}
