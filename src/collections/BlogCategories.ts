import type { CollectionConfig } from 'payload'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}
