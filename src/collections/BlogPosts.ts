import type { CollectionConfig } from 'payload'
import { authenticatedRead, canManageContent } from '@/access/admin'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  access: {
    read: authenticatedRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Blog Post', plural: 'Blog Posts' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Articles published on the blog. Supports SEO metadata and multi-language.',
    defaultColumns: ['title', 'status', 'isVisible', 'category', 'publishedAt', 'updatedAt'],
    components: { views: { list: { Component: '/admin/views/PostsView' } } },
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, localized: true },
    { name: 'content', type: 'richText', required: true, localized: true },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'blog-categories' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'publishedAt', type: 'date' },
    { name: 'readingTime', type: 'number', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Required with Published status before public rendering/indexing.' },
    },
  ],
}
