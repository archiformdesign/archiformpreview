import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Projects',
    type: 'document',

    fields: [
        defineField({
            name: 'title',
            title: 'Project Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Portfolio Category',
            type: 'string',
            options: {
                list: [
                    'Dining & Kitchen',
                    'Outdoor',
                    'Bedrooms',
                    'Details',
                    'Bathrooms',
                ],
            },
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'projectType',
            title: 'Project Type',
            type: 'string',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
        }),
        defineField({
            name: 'servicesProvided',
            title: 'Services Provided',
            type: 'string',
        }),
        defineField({
            name: 'introduction',
            title: 'Introduction',
            type: 'text',
        }),
        defineField({
            name: 'description',
            title: 'Project Description',
            type: 'text',
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'gallery',
            title: 'Project Gallery',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        { name: 'alt', title: 'Alternative Text', type: 'string' },
                        { name: 'wide', title: 'Full Width Image', type: 'boolean' },
                        { name: 'full', title: 'Show Full Image', type: 'boolean' },
                        {
                            name: 'kind',
                            title: 'Image Type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Completed Photography', value: 'photograph' },
                                    { title: 'Visualisation / Render', value: 'visualisation' },
                                ],
                            },
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'featured',
            title: 'Featured Project',
            type: 'boolean',
            initialValue: false,
        }),
    ],
})