import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block, CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { slugField } from '../fields/slug'

const serviceBannerBlock: Block = {
  slug: 'banner',
  interfaceName: 'ServiceBannerBlock',
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

export const Services: CollectionConfig = {
  slug: 'services',
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
      name: 'category',
      type: 'relationship',
      relationTo: 'service-categories',
      required: true,
      label: 'Category',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Card Description',
      admin: {
        description: 'Short description displayed in cards on /services.',
      },
    },
    {
      name: 'priceLabel',
      type: 'text',
      required: true,
      label: 'Price Label',
      admin: {
        description: 'Example: $ 10 /week, 28 /month',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      required: false,
      label: 'Website URL',
      admin: {
        description: 'Used by the "Go to the website" button on the service page.',
      },
    },
    {
      name: 'handle',
      type: 'text',
      required: false,
      label: 'Handle',
      admin: {
        description: 'Example: @keyproxy',
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
        description: 'Banner shown in the right sidebar on /services/[slug].',
      },
    },
    {
      name: 'promoCode',
      type: 'text',
      required: false,
      label: 'Promo Code',
    },
    {
      name: 'promoDescription',
      type: 'textarea',
      required: false,
      label: 'Promo Description',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Service Content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [serviceBannerBlock],
          }),
        ],
      }),
      admin: {
        description: 'Main rich text content rendered on /services/[slug].',
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
  ],
}
