import type { CollectionConfig } from 'payload'
import { canManageContent, visibleOrAuthenticated } from '@/access/admin'

export const UseCases: CollectionConfig = {
  slug: 'use-cases',
  access: {
    read: visibleOrAuthenticated,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Use Case', plural: 'Use Cases' },
  admin: {
    useAsTitle: 'industryName',
    group: 'Pages',
    description: 'Industry use cases shown on the Use Cases page.',
    defaultColumns: ['industryName', 'icon', 'sortOrder', 'isVisible'],
    components: { views: { list: { Component: '/admin/views/UseCasesView' } } },
  },
  fields: [
    { name: 'industryName', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, localized: true },
    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name' } },
    { name: 'shortDescription', type: 'textarea', required: true, localized: true },
    { name: 'longDescription', type: 'richText', localized: true },
    {
      name: 'challenges',
      type: 'array',
      localized: true,
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    {
      name: 'solutions',
      type: 'array',
      localized: true,
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'relatedFeatures', type: 'relationship', relationTo: 'features', hasMany: true },
    { name: 'relatedUseCases', type: 'relationship', relationTo: 'use-cases', hasMany: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
  ],
}
