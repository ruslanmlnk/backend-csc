import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { isAdminRequest } from '../access/isAdmin'

export const Categories: CollectionConfig = {
    slug: 'categories',
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
        },
        slugField('name'),
    ],
}
