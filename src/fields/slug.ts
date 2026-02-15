import { Field } from 'payload'

const format = (val: string): string =>
    val
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .toLowerCase()

export const slugField = (fieldToUse: string = 'title'): Field => ({
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    admin: {
        position: 'sidebar',
    },
    hooks: {
        beforeValidate: [
            ({ value, data }) => {
                if (typeof value === 'string' && value.length > 0) {
                    return format(value)
                }

                const fallbackData = data?.[fieldToUse]

                if (fallbackData && typeof fallbackData === 'string') {
                    return format(fallbackData)
                }

                return value
            },
        ],
    },
})
