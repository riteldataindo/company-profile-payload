import type { CollectionConfig } from 'payload'
import { canManageContent } from '@/access/admin'

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  access: {
    read: ({ req }) => req.user ? true : {
      isVisible: { equals: true },
      publiclyApproved: { equals: true },
    },
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'question',
    group: 'Pages',
    description: 'Questions & answers on the FAQ page.',
    defaultColumns: ['question', 'category', 'sortOrder', 'isVisible'],
    components: { views: { list: { Component: '/admin/views/FaqView' } } },
  },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    { name: 'answer', type: 'richText', required: true, localized: true },
    { name: 'category', type: 'text', localized: true, admin: { description: 'e.g. general, installation, analytics, pricing, technical' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'publiclyApproved', type: 'checkbox', defaultValue: false },
    { name: 'isVisible', type: 'checkbox', defaultValue: false },
  ],
}
