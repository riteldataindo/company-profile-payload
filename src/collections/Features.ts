import type { CollectionConfig } from 'payload'
import { canManageContent } from '@/access/admin'

export const Features: CollectionConfig = {
  slug: 'features',
  access: {
    read: ({ req }) => req.user ? true : {
      isVisible: { equals: true },
      publiclyApproved: { equals: true },
    },
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Feature', plural: 'Features' },
  admin: {
    useAsTitle: 'name',
    group: 'Pages',
    description: 'Product features shown on the Features page and homepage.',
    defaultColumns: ['name', 'icon', 'sortOrder', 'isVisible'],
    components: { views: { list: { Component: '/admin/views/FeaturesView' } } },
  },
  fields: [
    {
      name: 'stableId',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Locale-independent capability identifier.' },
    },
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, localized: true },
    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name (e.g. "users", "flame")' } },
    { name: 'shortDescription', type: 'textarea', required: true, localized: true },
    { name: 'longDescription', type: 'richText', localized: true },
    {
      name: 'benefits',
      type: 'array',
      localized: true,
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    {
      name: 'useCaseExamples',
      type: 'array',
      localized: true,
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    {
      name: 'relatedFeatures',
      type: 'relationship',
      relationTo: 'features',
      hasMany: true,
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'productTruth',
      type: 'group',
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
        {
          name: 'publicAvailability',
          type: 'select',
          required: true,
          defaultValue: 'deployment-dependent',
          options: [
            { label: 'Available', value: 'available' },
            { label: 'Deployment dependent', value: 'deployment-dependent' },
            { label: 'Pilot', value: 'pilot' },
            { label: 'Roadmap', value: 'roadmap' },
            { label: 'Not public', value: 'not-public' },
          ],
        },
        {
          name: 'commercialEntitlement',
          type: 'select',
          required: true,
          defaultValue: 'proposal',
          options: [
            { label: 'Core', value: 'core' },
            { label: 'Add-on', value: 'add-on' },
            { label: 'Confirmed in proposal', value: 'proposal' },
            { label: 'Not public', value: 'not-public' },
          ],
        },
        {
          name: 'requirements',
          type: 'group',
          fields: [
            { name: 'cctv', type: 'checkbox' },
            { name: 'sensor', type: 'checkbox' },
            { name: 'gpu', type: 'checkbox' },
            { name: 'pos', type: 'checkbox' },
            { name: 'floorPlan', type: 'checkbox' },
            { name: 'network', type: 'checkbox' },
            { name: 'other', type: 'text', localized: true },
          ],
        },
        { name: 'inputAndPrerequisites', type: 'textarea', localized: true },
        { name: 'outputDefinition', type: 'textarea', localized: true },
        { name: 'unitAndTimeWindow', type: 'text', localized: true },
        { name: 'updateBehavior', type: 'text', localized: true },
        { name: 'measurementScope', type: 'textarea', localized: true },
        { name: 'retailMeaning', type: 'textarea', localized: true },
        { name: 'mallMeaning', type: 'textarea', localized: true },
        { name: 'decisionSupported', type: 'textarea', localized: true },
        { name: 'limitationsAndValidation', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'evidence',
      type: 'group',
      fields: [
        {
          name: 'mediaStatus',
          type: 'select',
          required: true,
          defaultValue: 'none',
          options: [
            { label: 'Real redacted', value: 'real-redacted' },
            { label: 'Illustrative sample', value: 'illustrative-sample' },
            { label: 'Conceptual flow', value: 'conceptual-flow' },
            { label: 'None', value: 'none' },
          ],
        },
        { name: 'owner', type: 'text' },
        { name: 'reviewedAt', type: 'date' },
      ],
    },
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
