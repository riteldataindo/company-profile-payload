import type { CollectionConfig } from 'payload'
import { canManageContent, publicRead } from '@/access/admin'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    components: { views: { list: { Component: '/admin/views/CategoriesView' } } },
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}
