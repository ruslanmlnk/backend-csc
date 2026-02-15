import { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'author', 'status'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Title',
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
            },
            label: 'URL Slug',
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
            label: 'Short Description (for Hero)',
        },
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
            name: 'content',
            type: 'richText',
            required: true,
            label: 'Article Content',
        },
        {
            name: 'blockquote',
            type: 'textarea',
            label: 'Featured Quote (Blockquote)',
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
