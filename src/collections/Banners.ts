import type { CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'

export const Banners: CollectionConfig = {
  slug: 'banners',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: async ({ req }) => isAdminRequest(req),
    update: async ({ req }) => isAdminRequest(req),
    delete: async ({ req }) => isAdminRequest(req),
  },
  fields: [
    {
      name: 'caption',
      type: 'text',
      required: true,
      label: 'Banner Name',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Banner Image',
    },
    {
      name: 'link',
      type: 'text',
      required: false,
      label: 'Banner Link',
      admin: {
        description: 'Optional URL opened when users click this banner.',
        placeholder: 'https://example.com or /services',
      },
    },
  ],
}
