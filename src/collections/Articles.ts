import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block, CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { isAdminRequest } from '../access/isAdmin'

const articleBannerBlock: Block = {
    slug: 'banner',
    interfaceName: 'ArticleBannerBlock',
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

export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'author', 'status'],
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
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Main Image',
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            required: true,
            label: 'Category',
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Author',
        },
        {
            name: 'publishedDate',
            type: 'date',
            required: true,
            defaultValue: () => new Date(),
            label: 'Published Date',
        },
        {
            name: 'sidebarBanner',
            type: 'relationship',
            relationTo: 'banners',
            required: false,
            label: 'SideBar Banner',
            admin: {
                description: 'Banner shown in the right sidebar on /blog/[slug].',
            },
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
            label: 'Article Content',
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                    ...defaultFeatures,
                    BlocksFeature({
                        blocks: [articleBannerBlock],
                    }),
                ],
            }),
            admin: {
                description:
                    'Use the Banner block to insert a banner from the Banners collection by name.',
            },
        },
        {
            name: 'tags',
            type: 'array',
            label: 'Tags',
            fields: [
                {
                    name: 'tag',
                    type: 'text',
                },
            ],
        },
        {
            name: 'relatedArticles',
            type: 'relationship',
            relationTo: 'articles',
            hasMany: true,
            label: 'Related Articles',
            admin: {
                description:
                    'Optional manual related articles. If empty, the frontend falls back to automatic related selection.',
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
