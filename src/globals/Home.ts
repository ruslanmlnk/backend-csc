import type { GlobalConfig } from 'payload'
import { seoFields } from '../fields/seo'
import { isAdminRequest } from '../access/isAdmin'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
    update: async ({ req }) => isAdminRequest(req),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Block',
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
          name: 'valueProposition',
          type: 'text',
          required: true,
          label: 'Value Proposition',
          admin: {
            description: 'Text for the top badge, for example: "Inferra - built on data, driven by profit".',
          },
        },
        {
          name: 'primaryButtonLink',
          type: 'text',
          required: true,
          label: 'Primary Button Link',
        },
        {
          name: 'secondaryButtonLink',
          type: 'text',
          required: true,
          label: 'Secondary Button Link',
        },
      ],
    },
    ...seoFields,
  ],
}
