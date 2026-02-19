import type { GlobalConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { heroV2Field } from '../fields/heroV2'
import { seoFields } from '../fields/seo'

export const ForumPage: GlobalConfig = {
  slug: 'forum-page',
  label: 'Forum Page',
  access: {
    read: () => true,
    update: async ({ req }) => isAdminRequest(req),
  },
  fields: [heroV2Field, ...seoFields],
}
