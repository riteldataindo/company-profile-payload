import { APIError, type CollectionConfig } from 'payload'
import { canManageContent, publicRead } from '@/access/admin'
import { validateMediaUpload } from '@/lib/media-validation'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  access: {
    read: publicRead,
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
  ],
}
