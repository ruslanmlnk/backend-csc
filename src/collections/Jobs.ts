import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block, CollectionConfig } from 'payload'
import { isAdminRequest } from '../access/isAdmin'
import { slugField } from '../fields/slug'

const jobBannerBlock: Block = {
  slug: 'banner',
  interfaceName: 'JobBannerBlock',
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

const jobContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'JobContactBlock',
  labels: {
    singular: 'Contact',
    plural: 'Contacts',
  },
  fields: [
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Icon',
    },
    {
      name: 'contact',
      type: 'text',
      required: true,
      label: 'Contact',
    },
  ],
}

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'experience', 'format', 'badge', 'status', 'updatedAt'],
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
      name: 'badge',
      type: 'select',
      required: false,
      defaultValue: 'none',
      label: 'Card Badge',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'TOP',
          value: 'top',
        },
        {
          label: 'Urgent',
          value: 'urgent',
        },
      ],
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'job-locations',
      required: true,
      label: 'Location',
      admin: {
        description: 'Shown in card row and used in "All Locations" filter.',
      },
    },
    {
      name: 'format',
      type: 'relationship',
      relationTo: 'job-formats',
      required: true,
      label: 'Work Format',
      admin: {
        description: 'Shown in card row and used in "Any format" filter.',
      },
    },
    {
      name: 'experience',
      type: 'relationship',
      relationTo: 'job-experiences',
      required: true,
      label: 'Experience',
      admin: {
        description: 'Shown in card row and used in "Any experience" filter.',
      },
    },
    {
      name: 'salary',
      type: 'text',
      required: true,
      label: 'Salary',
      admin: {
        description: 'Example: from 1000 USD, after the interview.',
      },
    },
    {
      name: 'salaryInfo',
      type: 'text',
      required: true,
      label: 'Salary Info',
      admin: {
        description: 'Example: Kyiv, Ukraine, Remote.',
      },
    },
    {
      name: 'sidebarImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Sidebar Image',
      admin: {
        description: 'Image shown in the right sidebar on /jobs/[slug].',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Job Content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [jobBannerBlock, jobContactBlock],
          }),
        ],
      }),
      admin: {
        description: 'Main content for the job details page.',
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
