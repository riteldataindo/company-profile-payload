import type { CollectionConfig } from 'payload'
import {
  authenticatedRead,
  ownUserOrSuperAdmin,
  superAdminFieldOnly,
  superAdminOnly,
} from '@/access/admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: authenticatedRead,
    create: superAdminOnly,
    update: ownUserOrSuperAdmin,
    delete: superAdminOnly,
  },
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'name',
    group: 'System',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      access: {
        create: superAdminFieldOnly,
        update: superAdminFieldOnly,
      },
      options: [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
  ],
}
