import type { CollectionConfig } from 'payload'
import { canManageContent, visibleOrAuthenticated } from '@/access/admin'

export const Features: CollectionConfig = {
  slug: 'features',
  access: {
    read: visibleOrAuthenticated,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Feature', plural: 'Features' },
  admin: {
    useAsTitle: 'name',
    group: 'Pages',
    description: 'Product features shown on the Features page and homepage.',
    defaultColumns: ['name', 'icon', 'sortOrder', 'isVisible'],
    components: { views: { list: { Component: '/admin/views/FeaturesView' } } },
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, localized: true },
    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name (e.g. "users", "flame")' } },
    { name: 'shortDescription', type: 'textarea', required: true, localized: true },
    { name: 'longDescription', type: 'richText', localized: true },
    {
      name: 'benefits',
      type: 'array',
      localized: true,
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    {
      name: 'useCaseExamples',
      type: 'array',
      localized: true,
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    {
      name: 'relatedFeatures',
      type: 'relationship',
      relationTo: 'features',
      hasMany: true,
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
  ],
}
