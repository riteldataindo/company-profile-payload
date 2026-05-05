import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: { singular: 'Submission', plural: 'Submissions' },
  admin: {
    useAsTitle: 'email',
    group: 'Inbox',
    defaultColumns: ['formType', 'email', 'status', 'createdAt'],
    description: 'Form submissions from contact and demo request pages.',
    hideAPIURL: true,
    components: { views: { list: { Component: '/admin/views/InboxView' } } },
  },
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Demo Request', value: 'demo' },
      ],
      admin: { description: 'Source form type' },
    },
    { name: 'email', type: 'email', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
      ],
      admin: { description: 'Update status after reviewing or replying' },
    },
    {
      name: 'data',
      type: 'json',
      admin: { description: 'Full form data (name, phone, company, message, etc.)' },
    },
  ],
  access: {
    read: () => true,
    create: ({ req }) => !req?.user,
    update: () => true,
    delete: () => true,
  },
}
