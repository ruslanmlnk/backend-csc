import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block, CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { slugField } from '../fields/slug'

const partnershipBannerBlock: Block = {
  slug: 'banner',
  interfaceName: 'PartnershipBannerBlock',
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

const partnershipPayoutsBlock: Block = {
  slug: 'payouts',
  interfaceName: 'PartnershipPayoutsBlock',
  labels: {
    singular: 'Payouts',
    plural: 'Payouts',
  },
  fields: [
    {
      name: 'frequency',
      type: 'text',
      required: true,
      label: 'Frequency',
      admin: {
        placeholder: 'Once a day',
      },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      label: 'Currency',
      admin: {
        placeholder: 'USD',
      },
    },
    {
      name: 'minimumAmount',
      type: 'text',
      required: true,
      label: 'Minimum Amount',
      admin: {
        placeholder: '$100',
      },
    },
  ],
}

export const Partnerships: CollectionConfig = {
  slug: 'partnerships',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
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
      label: 'Program Name',
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
      name: 'category',
      type: 'relationship',
      relationTo: 'partnership-categories',
      required: false,
      label: 'Category',
      admin: {
        description: 'Used in the bottom categories filter row.',
      },
    },
    {
      name: 'rating',
      type: 'text',
      required: true,
      label: 'Rating',
      admin: {
        description: 'Example: 4.8',
      },
    },
    {
      name: 'foundedYear',
      type: 'text',
      required: true,
      label: 'Founded Year',
      admin: {
        description: 'Example: 2014',
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'job-locations',
      required: false,
      label: 'Location',
      admin: {
        description: 'Used in Location filter.',
      },
    },
    {
      name: 'models',
      type: 'array',
      required: false,
      label: 'Payment Models',
      fields: [
        {
          name: 'model',
          type: 'text',
          required: true,
          label: 'Model',
        },
      ],
    },
    {
      name: 'minPayment',
      type: 'text',
      required: true,
      label: 'Minimum Payment',
      admin: {
        description: 'Example: $100',
      },
    },
    {
      name: 'offers',
      type: 'array',
      required: false,
      label: 'Verticals',
      fields: [
        {
          name: 'offer',
          type: 'text',
          required: true,
          label: 'Vertical',
        },
      ],
    },
    {
      name: 'websiteUrl',
      type: 'text',
      required: false,
      label: 'Website URL',
      admin: {
        description: 'Used by the "Go to the website" button on detail page.',
      },
    },
    {
      name: 'sidebarBanner',
      type: 'relationship',
      relationTo: 'banners',
      required: false,
      label: 'SideBar Banner',
      admin: {
        description: 'Banner shown in the right sidebar on /partnerships/[slug].',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Partnership Content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [partnershipBannerBlock, partnershipPayoutsBlock],
          }),
        ],
      }),
      admin: {
        description: 'Main rich text content rendered on /partnerships/[slug].',
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
