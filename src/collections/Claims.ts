import type { CollectionConfig } from 'payload'
import { authenticatedRead, canManageContent } from '@/access/admin'

export const Claims: CollectionConfig = {
  slug: 'claims',
  access: {
    read: authenticatedRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Claim', plural: 'Claims' },
  admin: {
    useAsTitle: 'key',
    group: 'Governance',
    description: 'Approval records for public product, proof, and service claims.',
    defaultColumns: ['key', 'claimType', 'status', 'owner', 'reviewAt'],
  },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true },
    {
      name: 'approvedSentence',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Exact sentence approved for public use.' },
    },
    {
      name: 'claimType',
      type: 'select',
      required: true,
      options: [
        'capability',
        'performance',
        'customer',
        'deployment',
        'privacy',
        'commercial',
        'technical',
        'service',
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'approved', 'expired', 'rejected'],
    },
    { name: 'owner', type: 'text', required: true },
    { name: 'sourceArtifact', type: 'textarea', required: true },
    { name: 'definition', type: 'textarea', localized: true },
    { name: 'numeratorDenominator', type: 'textarea' },
    { name: 'cohortOrSiteClass', type: 'textarea' },
    { name: 'methodAndExclusions', type: 'textarea', localized: true },
    { name: 'approvedAt', type: 'date' },
    { name: 'reviewAt', type: 'date', required: true },
    {
      name: 'allowedRoutes',
      type: 'array',
      fields: [{ name: 'route', type: 'text', required: true }],
    },
    {
      name: 'allowedLocales',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Indonesia', value: 'id' },
      ],
    },
    { name: 'customerPermission', type: 'checkbox', defaultValue: false },
    { name: 'legalPermission', type: 'checkbox', defaultValue: false },
  ],
}
