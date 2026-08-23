import type { CollectionConfig } from 'payload'
import { canManageContent } from '@/access/admin'

export const UseCases: CollectionConfig = {
  slug: 'use-cases',
  access: {
    read: ({ req }) => req.user ? true : {
      isVisible: { equals: true },
      publiclyApproved: { equals: true },
    },
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
    {
      name: 'solutionType',
      type: 'select',
      required: true,
      defaultValue: 'shared',
      options: [
        { label: 'Shared', value: 'shared' },
        { label: 'Retail', value: 'retail' },
        { label: 'Mall', value: 'mall' },
      ],
    },
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
    { name: 'prerequisites', type: 'textarea', localized: true },
    { name: 'limitations', type: 'textarea', localized: true },
    {
      name: 'evidenceStatus',
      type: 'select',
      required: true,
      defaultValue: 'none',
      options: [
        { label: 'Permissioned evidence', value: 'permissioned' },
        { label: 'Illustrative sample', value: 'illustrative' },
        { label: 'None', value: 'none' },
      ],
    },
    { name: 'evidenceOwner', type: 'text' },
    { name: 'reviewedAt', type: 'date' },
    {
      name: 'claimRecords',
      type: 'relationship',
      relationTo: 'claims',
      hasMany: true,
      admin: { description: 'Approved claim records supporting public copy.' },
    },
    { name: 'publiclyApproved', type: 'checkbox', defaultValue: false },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isVisible', type: 'checkbox', defaultValue: false },
  ],
}
