import type { GlobalConfig } from 'payload'
import { seoFields } from '../fields/seo'
import { isAdminRequest } from '../access/isAdmin'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
    update: async ({ req }) => isAdminRequest(req),
  },
  fields: seoFields,
}
