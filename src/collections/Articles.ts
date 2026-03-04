import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block, CollectionConfig, PayloadRequest } from 'payload'
import { slugField } from '../fields/slug'
import { isAdminRequest } from '../access/isAdmin'
import { seoFields } from '../fields/seo'

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

const toNonNegativeInteger = (value: unknown): number => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.max(0, Math.floor(value))
    }

    if (typeof value === 'string' && value.trim()) {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) {
            return Math.max(0, Math.floor(parsed))
        }
    }

    return 0
}

const incrementArticleViews = async (req: PayloadRequest): Promise<Response> => {
    try {
        const slug = req.routeParams?.slug

        if (!slug || typeof slug !== 'string') {
            return Response.json({ error: 'Article slug is required.' }, { status: 400 })
        }

        const articleResult = await req.payload.find({
            collection: 'articles',
            where: {
                slug: {
                    equals: slug,
                },
            },
            limit: 1,
            depth: 0,
        })

        const article = articleResult.docs[0]
        if (!article) {
            return Response.json({ error: 'Article not found.' }, { status: 404 })
        }

        const currentViews = toNonNegativeInteger(article.views)
        const nextViews = currentViews + 1

        await req.payload.update({
            collection: 'articles',
            id: article.id,
            data: {
                views: nextViews,
            },
            depth: 0,
            req,
            overrideAccess: true,
        })

        return Response.json({ views: nextViews }, { status: 200 })
    } catch (error) {
        req.payload.logger.error(error, 'Failed to increment article views')
        return Response.json({ error: 'Unable to update article views.' }, { status: 500 })
    }
}

export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'author', 'status'],
    },
    endpoints: [
        {
            path: '/:slug/view',
            method: 'post',
            handler: incrementArticleViews,
        },
    ],
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
            name: 'cardPoster',
            type: 'upload',
            relationTo: 'media',
            required: false,
            label: 'Card Poster',
            admin: {
                description: 'Image used in article cards across blog lists, related articles, and search results.',
            },
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
            name: 'views',
            type: 'number',
            label: 'Views',
            required: true,
            defaultValue: 0,
            admin: {
                position: 'sidebar',
                readOnly: true,
                description: 'Automatically increments when an article page is opened.',
            },
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
        ...seoFields,
    ],
}
