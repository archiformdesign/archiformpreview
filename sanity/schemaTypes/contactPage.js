import {defineType, defineField} from 'sanity'

// Singleton: one "Contact Us" document (fixed ID set in sanity/deskStructure.js)
export default defineType({
  name: 'contactPage',
  title: 'Contact Us',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Label',
      type: 'string',
      initialValue: "Let's create your space",
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phones',
      title: 'Phone Numbers',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      description: 'Digits only, including country code (e.g. 971501821581).',
      type: 'string',
      validation: (Rule) => Rule.regex(/^\d+$/, {name: 'digits only'}),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram Handle',
      description: 'Handle only, without @.',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Studio Address',
      type: 'object',
      fields: [
        defineField({name: 'street', title: 'Street', type: 'string'}),
        defineField({name: 'city', title: 'City', type: 'string'}),
        defineField({name: 'country', title: 'Country', type: 'string'}),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Opening Hours',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Contact Us'}),
  },
})
