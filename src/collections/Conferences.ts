import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block, CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { slugField } from '../fields/slug'

const conferenceBannerBlock: Block = {
  slug: 'banner',
  interfaceName: 'ConferenceBannerBlock',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
  },
  fields: [
    {
      name: 'banner',
      type: 'relationship',
      relationTo: 'banners',
      required: true,
      label: 'Banner',
    },
  ],
}

export const Conferences: CollectionConfig = {
  slug: 'conferences',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data && (data.description === undefined || data.description === null)) {
          return {
            ...data,
            description: '',
          }
        }

        return data
      },
    ],
  },
  access: {
    read: () => true,
    create: async ({ req }) => isAdminRequest(req),
    update: async ({ req }) => isAdminRequest(req),
    delete: async ({ req }) => isAdminRequest(req),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    slugField(),
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      defaultValue: '',
      label: 'Card Description',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'job-locations',
      required: false,
      label: 'Location',
      admin: {
        description: 'Used in conference card and Location filter.',
      },
    },
    {
      name: 'conferenceDate',
      type: 'date',
      required: false,
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'vertical',
      type: 'relationship',
      relationTo: 'conferences-verticals',
      required: false,
      label: 'Vertical',
      admin: {
        description: 'Used in conference card and Vertical filter.',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      required: false,
      label: 'Website URL',
      admin: {
        description: 'Used by the "Go to the website" button on the conference page.',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Main Image',
    },
    {
      name: 'sidebarBanner',
      type: 'relationship',
      relationTo: 'banners',
      required: false,
      label: 'SideBar Banner',
      admin: {
        description: 'Banner shown in the right sidebar on /conferences/[slug].',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Conference Content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [conferenceBannerBlock],
          }),
        ],
      }),
      admin: {
        description: 'Main rich text content rendered on /conferences/[slug].',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      label: 'No Index',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'If checked, this item will be hidden from search engines and sitemap.',
      },
    },
  ],
}
