import type { CollectionConfig } from 'payload'

export const Features: CollectionConfig = {
  slug: 'features',
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
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name (e.g. "users", "flame")' } },
    { name: 'shortDescription', type: 'textarea', required: true, localized: true },
    { name: 'longDescription', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
  ],
}
