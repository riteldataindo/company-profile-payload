import type { CollectionConfig } from 'payload'
import { authenticatedRead, canManageContent } from '@/access/admin'

export const PricingTiers: CollectionConfig = {
  slug: 'pricing-tiers',
  access: {
    read: authenticatedRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Package', plural: 'Packages' },
  admin: {
    useAsTitle: 'name',
    group: 'Pages',
    description: 'Pricing packages on the Packages page.',
    defaultColumns: ['name', 'isVisible', 'isFeatured', 'sortOrder'],
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
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Required before this package can render publicly.' },
    },
    { name: 'ctaText', type: 'text', localized: true, defaultValue: 'Contact Us' },
    { name: 'ctaLink', type: 'text', defaultValue: '/contact' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
