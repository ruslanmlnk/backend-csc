import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { coerceLexicalRichTextValue } from '../fields/richText'

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

const normalizeThreadContent: CollectionBeforeChangeHook = async ({ data }) => {
  if (!data || typeof data !== 'object') {
    return data
  }

  const threadData = data as Record<string, unknown>
  if (!('content' in threadData)) {
    return data
  }

  return {
    ...threadData,
    content: coerceLexicalRichTextValue(threadData.content),
  }
}

export const Threads: CollectionConfig = {
  slug: 'threads',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'orderId', 'category', 'isLocked', 'author', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: async ({ req }) => isAdminRequest(req),
    delete: async ({ req }) => isAdminRequest(req),
  },
  hooks: {
    beforeChange: [normalizeThreadContent, assignAuthorOnCreate],
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
      type: 'relationship',
      relationTo: 'forum-sub-categories',
      required: true,
      label: 'SubCategory',
      index: true,
    },
    {
      name: 'isLocked',
      type: 'checkbox',
      label: 'Lock Thread',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'orderId',
      type: 'number',
      label: 'Order Id',
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Higher value means higher position in thread lists.',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      label: 'Tags',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
      editor: lexicalEditor(),
      admin: {
        description: 'Supports formatting, links, and image uploads inside forum threads.',
      },
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
    {
      name: 'noindex',
      type: 'checkbox',
      label: 'No Index',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'If checked, this thread will be hidden from search engines and sitemap.',
      },
    },
  ],
}
