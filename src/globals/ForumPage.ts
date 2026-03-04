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
  fields: [
    heroV2Field,
    {
      name: 'sidebarBanner',
      type: 'relationship',
      relationTo: 'banners',
      required: false,
      label: 'Sidebar Banner',
    },
    {
      name: 'pins',
      type: 'relationship',
      relationTo: 'threads',
      hasMany: true,
      required: false,
      label: 'Popular Threads (Pins)',
      admin: {
        description: 'Threads shown in the Popular threads sidebar, in this exact order.',
      },
    },
    ...seoFields,
  ],
}
