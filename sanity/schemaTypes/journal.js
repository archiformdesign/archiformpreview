import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'journal',
  title: 'Journal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publication',
      title: 'Publication',
      type: 'string',
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'date',
    }),
    defineField({
      name: 'pageReference',
      title: 'Page Reference (optional)',
      description: 'Where the feature appears in print, shown in the image caption, e.g. "Page 14".',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Introduction',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Feature Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'externalUrl',
      title: 'External Article URL',
      type: 'url',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (optional)',
      type: 'url',
    }),
  ],
})
