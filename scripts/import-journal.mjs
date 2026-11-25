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

const imagePath = path.join(process.cwd(), 'public/m/she-means-business-p14.jpg')

const asset = await client.assets.upload('image', createReadStream(imagePath), {
  filename: 'she-means-business-p14.jpg',
})

await client.createOrReplace({
  _id: 'journal-she-means-business-roula-jbour',
  _type: 'journal',
  title: 'Roula Jbour on homes that are beautiful, functional and supportive of healthier living.',
  slug: {
    _type: 'slug',
    current: 'roula-jbour-she-means-business',
  },
  publication: 'She Means Business',
  publisher: 'Gulf News',
  publishedAt: '2026-10-30',
  excerpt: 'In conversation with She Means Business, published by Gulf News, ARCHIFORM founder Roula Jbour talks about the healthcare background that shaped her approach, how wellbeing is changing the way we renovate our homes, and her advice for women building design businesses.',
  coverImage: {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
    alt: 'Page 14 of She Means Business: the interview with Roula Jbour, founder of ARCHIFORM, with her portrait',
  },
  externalUrl: 'https://features.gulfnews.com/books/oknx/?maxwidthtosmallmode=0&maxheighttosmallmode=0',
})

console.log('Journal feature imported successfully.')
