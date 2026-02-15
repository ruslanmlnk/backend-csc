import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

const hasAdminRole = (user: { role?: unknown } | null | undefined): boolean => user?.role === 'admin'

const assignRoleOnCreate: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || !data || typeof data !== 'object') {
    return data
  }

  const userData = data as Record<string, unknown>
  const incomingRole = userData.role
  const allowRoleAssignment = (req.context as Record<string, unknown> | undefined)?.allowRoleAssignment === true

  // Allow explicit role only for current admin or trusted server-side context.
  if (
    (hasAdminRole(req.user) || allowRoleAssignment) &&
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
    admin: ({ req: { user } }) => hasAdminRole(user),
    create: () => true,
    update: ({ req: { user }, id }) => {
      if (hasAdminRole(user)) return true
      if (user && user.id === id) return true
      return false
    },
    read: ({ req: { user }, id }) => {
      if (hasAdminRole(user)) return true
      if (user && user.id === id) return true
      return false
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
        create: ({ req: { user } }) => hasAdminRole(user),
        update: ({ req: { user } }) => hasAdminRole(user),
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
