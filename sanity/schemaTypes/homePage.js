import {defineType, defineField, defineArrayMember} from 'sanity'

// The home page is a scroll story (lib/home-story.js). Its films, 3D garden, hero headlines, diagram labels and icons stay
// in code; this document holds the copy and photos around them. Lists marked "exactly" must keep that many items, because
// the animation is timed to them; if they do not, the website keeps its built-in copy for that list.

const image = (name, title, description) =>
  defineField({
    name,
    title,
    description,
    type: 'image',
    options: {hotspot: true},
    fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule) => Rule.required()})],
  })

const titledText = (name) =>
  defineArrayMember({
    type: 'object',
    name,
    fields: [
      defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
      defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
    ],
  })

const exactly = (n) => (Rule) => Rule.length(n).error(`Keep exactly ${n} items: the home page animation is timed to ${n}.`)

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Opening', default: true},
    {name: 'living', title: 'Healthy Living'},
    {name: 'details', title: 'Quieter Details'},
    {name: 'featured', title: 'Featured Project'},
    {name: 'process', title: 'Process'},
    {name: 'founder', title: 'Founder'},
    {name: 'journey', title: 'Transformation'},
    {name: 'close', title: 'Closing'},
  ],
  fields: [
    defineField({name: 'heroIntro', title: 'Opening Paragraph', type: 'text', rows: 4, group: 'hero'}),
    defineField({
      name: 'heroValues',
      title: 'Opening Values',
      description: 'The three short lines under the opening paragraph.',
      type: 'array',
      of: [{type: 'string'}],
      group: 'hero',
      validation: exactly(3),
    }),

    defineField({name: 'walkInLabel', title: 'Walk-in Label', type: 'string', group: 'living'}),
    defineField({name: 'walkInHeading', title: 'Walk-in Heading', type: 'string', group: 'living'}),
    defineField({name: 'walkInText', title: 'Walk-in Line', type: 'string', group: 'living'}),
    defineField({
      name: 'panels',
      title: 'Room Panels',
      description: 'Shown over the four room films, in order: light, airflow, materials, living.',
      type: 'array',
      of: [titledText('panel')],
      group: 'living',
      validation: exactly(4),
    }),
    defineField({name: 'holisticLabel', title: 'Holistic Design Label', type: 'string', group: 'living'}),
    defineField({
      name: 'holisticHeading',
      title: 'Holistic Design Heading',
      description: 'The words "as One." are set in italics while the heading ends with them.',
      type: 'string',
      group: 'living',
    }),
    defineField({name: 'holisticText', title: 'Holistic Design Text', type: 'text', rows: 3, group: 'living'}),

    defineField({name: 'detailsLabel', title: 'Label', type: 'string', group: 'details'}),
    defineField({
      name: 'detailsHeading',
      title: 'Heading',
      description: 'The word "Healthy?" is set in italics while the heading ends with it.',
      type: 'string',
      group: 'details',
    }),
    defineField({name: 'detailsText', title: 'Text', type: 'text', rows: 4, group: 'details'}),
    defineField({
      name: 'detailCards',
      title: 'Cards',
      type: 'array',
      group: 'details',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'detailCard',
          fields: [
            image('image', 'Image'),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
            defineField({name: 'points', title: 'Points', type: 'array', of: [{type: 'string'}]}),
          ],
          preview: {select: {title: 'title', subtitle: 'subtitle', media: 'image'}},
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),

    defineField({
      name: 'featuredSubtitle',
      title: 'Featured Project Subtitle',
      description:
        'The project shown is the one with "Featured Project" ticked under Portfolio (Emirates Living Villa when none is). Its name, location, type and services come from the project. The film behind it is set in code.',
      type: 'string',
      group: 'featured',
    }),
    defineField({name: 'featuredText', title: 'Featured Project Text', type: 'text', rows: 4, group: 'featured'}),
    defineField({name: 'featuredQuote', title: 'Quote', description: 'Without quotation marks; they are added on the page.', type: 'string', group: 'featured'}),

    defineField({name: 'processHeading', title: 'Heading', type: 'string', group: 'process'}),
    defineField({
      name: 'processSteps',
      title: 'Steps',
      description: 'Each step is shown with its own picture, in order.',
      type: 'array',
      of: [titledText('step')],
      group: 'process',
      validation: exactly(4),
    }),

    defineField({name: 'founderLabel', title: 'Label', type: 'string', group: 'founder'}),
    defineField({name: 'founderHeading', title: 'Heading', type: 'string', group: 'founder'}),
    defineField({name: 'founderText', title: 'Text', type: 'text', rows: 3, group: 'founder'}),
    defineField({name: 'founderQuote', title: 'Quote', description: 'Without quotation marks; they are added on the page.', type: 'text', rows: 2, group: 'founder'}),
    defineField({name: 'founderSignature', title: 'Signature', type: 'string', group: 'founder'}),
    image('founderImage', 'Portrait', 'Also used as the arched picture that glides into place from the process section.'),

    defineField({
      name: 'journeyHeading',
      title: 'Heading',
      description: 'The word "Transformation." is set in italics while the heading ends with it.',
      type: 'string',
      group: 'journey',
    }),
    defineField({
      name: 'journey',
      title: 'Pictures',
      description: 'Before, inspiration and the finished room, shown left to right.',
      type: 'array',
      group: 'journey',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'journeyStep',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
            image('image', 'Image'),
          ],
          preview: {select: {title: 'label', media: 'image'}},
        }),
      ],
      validation: exactly(3),
    }),

    defineField({name: 'closeLabel', title: 'Label', type: 'string', group: 'close'}),
    defineField({name: 'closeHeading', title: 'Heading', type: 'string', group: 'close'}),
    defineField({name: 'closeParagraphs', title: 'Paragraphs', type: 'array', of: [{type: 'text', rows: 2}], group: 'close'}),
    defineField({name: 'closeCta', title: 'Button Label', type: 'string', group: 'close'}),
  ],
  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
