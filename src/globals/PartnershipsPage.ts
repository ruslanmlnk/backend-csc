import type { GlobalConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { heroV2Field } from '../fields/heroV2'
import { seoFields } from '../fields/seo'

export const PartnershipsPage: GlobalConfig = {
  slug: 'partnerships-page',
  label: 'Partnerships Page',
  access: {
    read: () => true,
    update: async ({ req }) => isAdminRequest(req),
  },
  fields: [heroV2Field, ...seoFields],
}
