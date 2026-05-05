import type { CollectionConfig } from 'payload'

export const UseCases: CollectionConfig = {
  slug: 'use-cases',
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
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name' } },
    { name: 'shortDescription', type: 'textarea', required: true, localized: true },
    { name: 'longDescription', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'relatedFeatures', type: 'relationship', relationTo: 'features', hasMany: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
  ],
}
