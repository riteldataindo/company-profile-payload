import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
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
  ],
}
