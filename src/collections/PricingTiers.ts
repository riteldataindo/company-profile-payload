import type { CollectionConfig } from 'payload'

export const PricingTiers: CollectionConfig = {
  slug: 'pricing-tiers',
  labels: { singular: 'Package', plural: 'Packages' },
  admin: {
    useAsTitle: 'name',
    group: 'Pages',
    description: 'Pricing packages on the Packages page.',
    defaultColumns: ['name', 'isFeatured', 'sortOrder'],
    components: { views: { list: { Component: '/admin/views/PricingView' } } },
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'featureText', type: 'text', required: true, localized: true },
        { name: 'included', type: 'checkbox', defaultValue: true },
      ],
    },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
    { name: 'ctaText', type: 'text', localized: true, defaultValue: 'Contact Us' },
    { name: 'ctaLink', type: 'text', defaultValue: '/contact' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
