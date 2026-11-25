import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Us',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'About Us',
    }),
    defineField({
      name: 'founderName',
      title: 'Founder Name',
      type: 'string',
    }),
    defineField({
      name: 'founderRole',
      title: 'Founder Role',
      type: 'string',
    }),
    defineField({
      name: 'founderImage',
      title: 'Founder Portrait',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'introduction',
      title: 'Founder Introduction',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'approachHeading',
      title: 'Approach Heading',
      type: 'string',
    }),
    defineField({
      name: 'approachText',
      title: 'Approach Description',
      type: 'text',
    }),
    defineField({
      name: 'approachImage',
      title: 'Approach Image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'pillars',
      title: 'Design Principles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pillar',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'text', title: 'Description', type: 'text'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'studioHeading',
      title: 'Studio Heading',
      type: 'string',
    }),
    defineField({
      name: 'studioDescription',
      title: 'Studio Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
})
