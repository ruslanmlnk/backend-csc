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
  ],
}
