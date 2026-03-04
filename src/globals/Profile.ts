import type { GlobalConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profile',
  access: {
    read: () => true,
    update: async ({ req }) => isAdminRequest(req),
  },
  fields: [
    {
      name: 'banner',
      type: 'relationship',
      relationTo: 'banners',
      required: false,
      label: 'Banner',
    },
  ],
}
