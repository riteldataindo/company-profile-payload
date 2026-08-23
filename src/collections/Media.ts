import { APIError, type CollectionConfig } from 'payload'
import { canManageContent } from '@/access/admin'
import { validateMediaUpload } from '@/lib/media-validation'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  access: {
    read: ({ req }) => req.user ? true : {
      permissionStatus: { equals: 'approved' },
      provenanceStatus: { not_equals: 'unreviewed' },
    },
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  admin: { group: 'System' },
  hooks: {
    beforeValidate: [
      ({ operation, req }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          try {
            validateMediaUpload(req.file)
          } catch (error) {
            throw new APIError(
              error instanceof Error ? error.message : 'Invalid media upload',
              400,
              null,
              true,
            )
          }
        }
      },
    ],
  },
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    allowRestrictedFileTypes: false,
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
      'video/mp4',
      'application/pdf',
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true, localized: true },
    { name: 'caption', type: 'text', localized: true },
    {
      name: 'provenanceStatus',
      type: 'select',
      required: true,
      defaultValue: 'unreviewed',
      options: [
        { label: 'Unreviewed', value: 'unreviewed' },
        { label: 'Real redacted', value: 'real-redacted' },
        { label: 'Real public', value: 'real-public' },
        { label: 'Illustrative sample', value: 'illustrative-sample' },
        { label: 'Conceptual', value: 'conceptual' },
      ],
    },
    { name: 'source', type: 'text' },
    { name: 'owner', type: 'text' },
    { name: 'capturedAt', type: 'date' },
    {
      name: 'permissionStatus',
      type: 'select',
      required: true,
      defaultValue: 'unreviewed',
      options: ['unreviewed', 'approved', 'restricted', 'expired'],
    },
    {
      name: 'approvedLocales',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Indonesia', value: 'id' },
      ],
    },
    {
      name: 'approvedRoutes',
      type: 'array',
      fields: [{ name: 'route', type: 'text', required: true }],
    },
    { name: 'reviewAt', type: 'date' },
  ],
}
