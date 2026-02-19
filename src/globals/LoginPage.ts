import type { GlobalConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'

export const LoginPage: GlobalConfig = {
  slug: 'login-page',
  label: 'Login Page',
  access: {
    read: () => true,
    update: async ({ req }) => isAdminRequest(req),
  },
  fields: [
    {
      name: 'leftBanner',
      type: 'relationship',
      relationTo: 'banners',
      required: false,
      label: 'Left Banner',
    },
    {
      name: 'rightBanner',
      type: 'relationship',
      relationTo: 'banners',
      required: false,
      label: 'Right Banner',
    },
  ],
}
