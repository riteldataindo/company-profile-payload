import type { CollectionConfig } from 'payload'
import { canManageContent } from '@/access/admin'
import { normalizeClientLogoMedia } from '@/lib/clientLogos/normalizeClientLogo'

function getRelationId(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : undefined
  }
  return undefined
}

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  access: {
    read: ({ req }) => req.user ? true : {
      isVisible: { equals: true },
      permissionStatus: { equals: 'approved' },
      customerStatus: { equals: 'active' },
    },
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  labels: { singular: 'Client Logo', plural: 'Client Logos' },
  admin: {
    useAsTitle: 'companyName',
    group: 'Marketing',
    description: 'Client logos shown in the homepage carousel.',
    defaultColumns: ['companyName', 'logo', 'isVisible', 'sortOrder'],
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        const nextLogoId = getRelationId(data.logo)
        const previousLogoId = getRelationId(originalDoc?.logo)

        if (!nextLogoId || (operation === 'update' && nextLogoId === previousLogoId)) {
          return data
        }

        await normalizeClientLogoMedia({
          payload: req.payload,
          mediaId: nextLogoId,
          companyName: String(data.companyName || originalDoc?.companyName || 'Client'),
          req,
        })

        return data
      },
    ],
  },
  fields: [
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      required: true,
      admin: { description: 'Used as the logo alt text and record name.' },
    },
    {
      name: 'logo',
      label: 'Logo Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        description: 'Upload PNG, JPG, WebP, or SVG. White edge backgrounds, excess margins, and square/portrait sizing are normalized automatically.',
      },
    },
    {
      name: 'darkModeLogo',
      label: 'Dark Mode Logo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: { hidden: true },
    },
    {
      name: 'websiteUrl',
      label: 'Website URL',
      type: 'text',
      validate: (value: string | null | undefined) => {
        if (!value) return true

        try {
          const url = new URL(value)
          return ['http:', 'https:'].includes(url.protocol)
            || 'Website URL must start with http:// or https://.'
        } catch {
          return 'Enter a valid website URL, including https://.'
        }
      },
      admin: { description: 'Optional. Makes the logo clickable.' },
    },
    {
      name: 'isVisible',
      label: 'Show on Homepage',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'permissionStatus',
      type: 'select',
      required: true,
      defaultValue: 'unreviewed',
      options: ['unreviewed', 'approved', 'expired', 'revoked'],
    },
    {
      name: 'customerStatus',
      type: 'select',
      required: true,
      defaultValue: 'unverified',
      options: ['unverified', 'active', 'former'],
    },
    { name: 'moduleScope', type: 'text' },
    { name: 'siteScope', type: 'text' },
    { name: 'permissionDate', type: 'date' },
    { name: 'reviewAt', type: 'date' },
    {
      name: 'sortOrder',
      label: 'Sort Order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first.' },
    },
  ],
}
