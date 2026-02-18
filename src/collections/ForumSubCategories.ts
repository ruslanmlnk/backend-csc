import { CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { slugField } from '../fields/slug'

export const ForumSubCategories: CollectionConfig = {
  slug: 'forum-sub-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'description', 'textAboveDate', 'date', 'updatedAt'],
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
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Description',
    },
    {
      name: 'textAboveDate',
      type: 'text',
      required: true,
      label: 'Text Above Date',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'forum-categories',
      required: true,
      label: 'Category',
      index: true,
    },
    slugField('name'),
  ],
}
