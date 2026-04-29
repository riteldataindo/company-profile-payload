import type { CollectionConfig } from 'payload'

export const UseCases: CollectionConfig = {
  slug: 'use-cases',
  admin: { useAsTitle: 'industryName' },
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
