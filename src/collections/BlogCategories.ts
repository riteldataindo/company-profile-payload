import type { CollectionConfig } from 'payload'
import { authenticatedRead, canManageContent } from '@/access/admin'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  access: {
    read: authenticatedRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'isVisible', 'updatedAt'],
    components: { views: { list: { Component: '/admin/views/CategoriesView' } } },
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Required before this category can render publicly.' },
    },
  ],
}
