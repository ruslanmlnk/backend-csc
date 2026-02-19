import type { Field } from 'payload'

export const heroV2Field: Field = {
  name: 'heroV2',
  type: 'group',
  label: 'HeroV2',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
    },
    {
      name: 'banner',
      type: 'relationship',
      relationTo: 'banners',
      required: false,
      label: 'Banner',
    },
  ],
}
