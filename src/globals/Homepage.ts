import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true, defaultValue: 'AI People Counting & CCTV Analytics' },
        { name: 'subtitle', type: 'textarea', localized: true },
        {
          name: 'ctaPrimary',
          type: 'group',
          fields: [
            { name: 'text', type: 'text', localized: true, defaultValue: 'Get Free Demo' },
            { name: 'link', type: 'text', defaultValue: '/demo' },
          ],
        },
        {
          name: 'ctaSecondary',
          type: 'group',
          fields: [
            { name: 'text', type: 'text', localized: true, defaultValue: 'See How It Works' },
            { name: 'link', type: 'text', defaultValue: '#features' },
          ],
        },
      ],
    },
    {
      name: 'statsBar',
      type: 'array',
      defaultValue: [
        { value: '99.9%', label: 'Accuracy' },
        { value: '12+', label: 'Analytics Features' },
        { value: '300+', label: 'Stores Served' },
      ],
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, localized: true },
      ],
    },
  ],
}
