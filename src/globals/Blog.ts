import type { GlobalConfig } from 'payload'
import { seoFields } from '../fields/seo'
import { isAdminRequest } from '../access/isAdmin'

export const Blog: GlobalConfig = {
    slug: 'blog',
    label: 'Blog Page',
    access: {
        read: () => true,
        update: async ({ req }) => isAdminRequest(req),
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Hero Title',
            localized: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
            label: 'Hero Description',
            localized: true,
        },
        {
            name: 'horizontalBanner',
            type: 'relationship',
            relationTo: 'banners',
            required: false,
            label: 'Horizontal Banner',
            admin: {
                description: 'Banner shown below the hero heading on the blog page.',
            },
        },
        {
            name: 'banner',
            type: 'relationship',
            relationTo: 'banners',
            required: false,
            label: 'Banner',
        },
        ...seoFields,
    ],
}
