import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'

const assignUserOnCreate: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || !data || typeof data !== 'object') {
    return data
  }

  if (!req.user?.id) {
    return data
  }

  const commentData = data as Record<string, unknown>
  if (commentData.user) {
    return data
  }

  return {
    ...commentData,
    user: req.user.id,
  }
}

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'comment',
    defaultColumns: ['comment', 'user', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: async ({ req }) => isAdminRequest(req),
    delete: async ({ req }) => isAdminRequest(req),
  },
  hooks: {
    beforeChange: [assignUserOnCreate],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      label: 'Comment Text',
    },
  ],
}
