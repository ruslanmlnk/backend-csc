import type { Field } from 'payload'

export const seoFields: Field[] = [
  {
    name: 'seo',
    type: 'group',
    label: 'SEO Settings',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        label: 'Meta Title',
      },
      {
        name: 'description',
        type: 'textarea',
        required: true,
        label: 'Meta Description',
      },
      {
        name: 'ogImage',
        type: 'upload',
        relationTo: 'media',
        label: 'Open Graph Image',
      },
    ],
  },
]
