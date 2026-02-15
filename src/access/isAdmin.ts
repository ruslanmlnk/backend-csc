import type { PayloadRequest } from 'payload'

type RequestUser = {
  id?: number | string
  role?: unknown
}

const hasAdminRole = (user: RequestUser | null | undefined): boolean => user?.role === 'admin'

export const isAdminRequest = async (req: PayloadRequest): Promise<boolean> => {
  const user = req.user as RequestUser | null | undefined

  if (hasAdminRole(user)) {
    return true
  }

  if (!user?.id) {
    return false
  }

  try {
    const dbUser = await req.payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 0,
      overrideAccess: true,
      req,
    })

    return dbUser?.role === 'admin'
  } catch {
    return false
  }
}

