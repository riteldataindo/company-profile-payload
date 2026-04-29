import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  fields: [
    {
      name: 'mainMenu',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'link', type: 'text', required: true },
      ],
    },
    {
      name: 'footerMenu',
      type: 'group',
      fields: [
        {
          name: 'product',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
        {
          name: 'resources',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
