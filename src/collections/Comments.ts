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

const extractEntityId = (value: unknown): string | number | null => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const entity = value as { id?: unknown }
  if (typeof entity.id === 'string' || typeof entity.id === 'number') {
    return entity.id
  }

  return null
}

const ensureThreadUnlockedOnCreate: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || !data || typeof data !== 'object') {
    return data
  }

  const commentData = data as Record<string, unknown>
  const threadId = extractEntityId(commentData.thread)
  if (!threadId) {
    return data
  }

  const result = await req.payload.find({
    collection: 'threads',
    where: {
      id: {
        equals: threadId,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })

  if (result.docs[0]?.isLocked) {
    throw new Error('This thread is locked. New comments are disabled.')
  }

  return data
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
    beforeChange: [assignUserOnCreate, ensureThreadUnlockedOnCreate],
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
      name: 'thread',
      type: 'relationship',
      relationTo: 'threads',
      required: true,
      label: 'Thread',
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
