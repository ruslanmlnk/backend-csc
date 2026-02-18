import { CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { slugField } from '../fields/slug'

export const JobFormats: CollectionConfig = {
  slug: 'job-formats',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: async ({ req }) => isAdminRequest(req),
    update: async ({ req }) => isAdminRequest(req),
    delete: async ({ req }) => isAdminRequest(req),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    slugField('name'),
  ],
}
