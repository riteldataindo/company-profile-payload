import type { CollectionConfig } from 'payload'

export const DeploymentLocations: CollectionConfig = {
  slug: 'deployment-locations',
  labels: { singular: 'Location', plural: 'Locations' },
  admin: {
    useAsTitle: 'cityName',
    group: 'Marketing',
    description: 'Deployment dots on the Indonesia map.',
    defaultColumns: ['cityName', 'isMajor', 'isVisible', 'sortOrder'],
    components: { views: { list: { Component: '/admin/views/LocationsView' } } },
  },
  fields: [
    { name: 'cityName', type: 'text', required: true, admin: { description: 'City name shown on hover and as label' } },
    { name: 'longitude', type: 'number', required: true, admin: { description: 'e.g. 106.85 for Jakarta' } },
    { name: 'latitude', type: 'number', required: true, admin: { description: 'e.g. -6.2 for Jakarta (negative = south)' } },
    { name: 'isMajor', type: 'checkbox', defaultValue: false, admin: { description: 'Major city = bigger dot + always show label' } },
    { name: 'isVisible', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
