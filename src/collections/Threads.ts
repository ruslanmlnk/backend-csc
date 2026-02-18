import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'

const assignAuthorOnCreate: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || !data || typeof data !== 'object') {
    return data
  }

  if (!req.user?.id) {
    return data
  }

  const threadData = data as Record<string, unknown>
  if (threadData.author) {
    return data
  }

  return {
    ...threadData,
    author: req.user.id,
  }
}

export const Threads: CollectionConfig = {
  slug: 'threads',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: async ({ req }) => isAdminRequest(req),
    delete: async ({ req }) => isAdminRequest(req),
  },
  hooks: {
    beforeChange: [assignAuthorOnCreate],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      label: 'Category',
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      label: 'Tags',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Content',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Author',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
