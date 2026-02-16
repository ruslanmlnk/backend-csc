import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'

const isSameUser = (
  user: { id?: unknown } | null | undefined,
  id: number | string | undefined,
): boolean => {
  if (!user || user.id === undefined || id === undefined) {
    return false
  }

  return String(user.id) === String(id)
}

const assignRoleOnCreate: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || !data || typeof data !== 'object') {
    return data
  }

  const userData = data as Record<string, unknown>
  const incomingRole = userData.role
  const allowRoleAssignment = (req.context as Record<string, unknown> | undefined)?.allowRoleAssignment === true
  const isAdmin = await isAdminRequest(req)

  // Allow explicit role only for current admin or trusted server-side context.
  if (
    (isAdmin || allowRoleAssignment) &&
    (incomingRole === 'admin' || incomingRole === 'user')
  ) {
    return data
  }

  const { totalDocs } = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req,
  })

  return {
    ...userData,
    role: totalDocs === 0 ? 'admin' : 'user',
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  auth: true,
  access: {
    admin: async ({ req }) => isAdminRequest(req),
    create: () => true,
    update: async ({ req, id }) => {
      if (await isAdminRequest(req)) return true
      const { user } = req
      if (isSameUser(user, id)) return true
      return false
    },
    read: async ({ req, id }) => {
      if (await isAdminRequest(req)) return true
      const { user } = req
      if (isSameUser(user, id)) return true
      // Public read is required to show article author data on public pages.
      return true
    },
  },
  hooks: {
    beforeChange: [assignRoleOnCreate],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      required: true,
      saveToJWT: true,
      access: {
        create: async ({ req }) => isAdminRequest(req),
        update: async ({ req }) => isAdminRequest(req),
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'position',
      type: 'text',
    },
    {
      name: 'directions',
      type: 'text',
    },
    {
      name: 'instagram',
      type: 'text',
    },
    {
      name: 'facebook',
      type: 'text',
      label: 'Facebook',
    },
    {
      name: 'linkedin',
      type: 'text',
      label: 'LinkedIn',
    },
    {
      name: 'telegram',
      type: 'text',
    },
    {
      name: 'tiktok',
      type: 'text',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
