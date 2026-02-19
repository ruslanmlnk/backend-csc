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
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Block',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
        {
          name: 'valueProposition',
          type: 'text',
          required: true,
          label: 'Value Proposition',
          admin: {
            description: 'Text for the top badge, for example: "Inferra - built on data, driven by profit".',
          },
        },
        {
          name: 'primaryButtonLink',
          type: 'text',
          required: true,
          label: 'Primary Button Link',
        },
        {
          name: 'secondaryButtonLink',
          type: 'text',
          required: true,
          label: 'Secondary Button Link',
        },
      ],
    },
    {
      name: 'whatWeDo',
      type: 'group',
      label: 'What We Do Block',
      fields: [
        {
          name: 'badgeText',
          type: 'text',
          required: true,
          label: 'Badge Text',
          defaultValue: 'What we do',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
          defaultValue: 'Performance marketing built on data',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
          defaultValue:
            'ClickStorm is a performance-driven agency working at the intersection of traffic arbitrage, CPA marketing, and analytics. We launch, test, and scale traffic across multiple sources while keeping full control over metrics, budgets, and profitability.',
        },
        {
          name: 'buttonLink',
          type: 'text',
          required: true,
          label: 'Button Link',
          defaultValue: '/services',
          admin: {
            description: 'Where the "Learn More" button should lead. Supports relative paths and full URLs.',
          },
        },
      ],
    },
    {
      name: 'coreValues',
      type: 'group',
      label: 'Core Values Block',
      fields: [
        {
          name: 'badgeText',
          type: 'text',
          required: true,
          label: 'Badge Text',
          defaultValue: 'Core Values',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
          defaultValue: 'The Values that Drive Everything We Do',
        },
        {
          name: 'cards',
          type: 'array',
          required: true,
          minRows: 1,
          label: 'Cards',
          fields: [
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Icon',
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Title',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Description',
            },
          ],
          admin: {
            description: 'Editable Core Values cards shown on the home page.',
          },
        },
      ],
    },
    ...seoFields,
  ],
}
