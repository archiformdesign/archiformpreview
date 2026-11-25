import nextEnv from '@next/env'
import {createClient} from '@sanity/client'
import {createReadStream} from 'node:fs'
import path from 'node:path'

const {loadEnvConfig} = nextEnv
loadEnvConfig(process.cwd())

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-11-21',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function uploadImage(src) {
  const filePath = path.join(process.cwd(), 'public', src.replace(/^\/+/, ''))
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

const founderImage = await uploadImage('/m/roula.jpg')
const approachImage = await uploadImage('/m/approach-skyline.jpg')

await client.createOrReplace({
  _id: 'aboutPage',
  _type: 'aboutPage',
  title: 'About Us',
  founderName: 'Roula Jbour',
  founderRole: 'Founder & Interior Designer, ARCHIFORM',
  founderImage: {
    ...founderImage,
    alt: 'Roula Jbour, founder of ARCHIFORM',
  },
  introduction: [
    { _type: 'block', _key: 'intro-1', style: 'normal', children: [{_type: 'span', _key: 's1', text: 'My journey began in healthcare, where I came to see how deeply our surroundings shape the way we feel: the morning light, the materials we live with, the air we breathe.'}], markDefs: [] },
    { _type: 'block', _key: 'intro-2', style: 'normal', children: [{_type: 'span', _key: 's2', text: 'That belief led me to found ARCHIFORM, bringing together two passions that have always felt connected: people and spaces. I love the creative process, but I care just as much about the details that make a home comfortable and easy to live in.'}], markDefs: [] },
    { _type: 'block', _key: 'intro-3', style: 'normal', children: [{_type: 'span', _key: 's3', text: 'Because a home should never feel like a showroom. It should feel like you.'}], markDefs: [] },
  ],
  approachHeading: 'What if your home could feel as good as it looks?',
  approachText: 'Informed by a background in healthcare, we consider lighting, ventilation, cooling and materials alongside intuitive layouts and timeless aesthetics.',
  approachImage: {
    ...approachImage,
    alt: 'A warm living room at sunset with a curved sofa, an olive tree and the Dubai skyline beyond the glass',
  },
  pillars: [
    { _key: 'pillar-1', title: '01. Wellbeing by Design', text: 'Light, airflow and materials that feel good to live with.' },
    { _key: 'pillar-2', title: '02. Function with Purpose', text: 'Intuitive layouts that work around everyday life.' },
    { _key: 'pillar-3', title: '03. Timeless Aesthetics', text: 'Authentic materials and proportions beyond trends.' },
    { _key: 'pillar-4', title: '04. Personal Connection', text: 'Your home should tell your story, not ours.' },
  ],
  studioHeading: 'A more thoughtful way to create home.',
  studioDescription: [
    { _type: 'block', _key: 'studio-1', style: 'normal', children: [{_type: 'span', _key: 's4', text: 'We spend so much of our lives within our homes, yet we often focus more on how a space looks than how it makes us feel. At ARCHIFORM, we believe the two should never be separate.'}], markDefs: [] },
    { _type: 'block', _key: 'studio-2', style: 'normal', children: [{_type: 'span', _key: 's5', text: 'Based in Dubai, we specialise in interior design, residential renovations and project management, creating homes that are truly lived in, loved and felt.'}], markDefs: [] },
  ],
})

console.log('About Us imported successfully.')

await client.createOrReplace({
  _id: 'contactPage',
  _type: 'contactPage',
  eyebrow: "Let's create your space",
  heading: 'Get in touch',
  introduction: 'Tell us about your project. We would love to hear from you.',
  email: 'hello@archiformdesign.me',
  phones: ['+971 50 182 1581'],
  whatsapp: '971501821581',
  instagram: 'archiform_design_studio',
  address: {
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  hours: 'By appointment only',
})

console.log('Contact Us imported successfully.')
