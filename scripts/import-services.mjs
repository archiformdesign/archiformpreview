import nextEnv from '@next/env'
import {createClient} from '@sanity/client'
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {services} from '../content/services.js'

const {loadEnvConfig} = nextEnv
loadEnvConfig(process.cwd())

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-11-21',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const imageAssets = new Map()

for (const service of services) {
  const imagePath = path.join(process.cwd(), 'public', service.image.replace(/^\/+/, ''))

  if (!existsSync(imagePath)) {
    throw new Error(`Image not found: ${service.image}`)
  }

  if (!imageAssets.has(service.image)) {
    const asset = await client.assets.upload('image', createReadStream(imagePath), {
      filename: path.basename(imagePath),
    })
    imageAssets.set(service.image, asset._id)
    console.log(`Uploaded: ${service.image}`)
  }
}

for (const [index, service] of services.entries()) {
  const slug = service.name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  await client.createOrReplace({
    _id: `service-${slug}`,
    _type: 'service',
    title: service.name,
    slug: {_type: 'slug', current: slug},
    rail: service.rail,
    tagline: service.tagline,
    description: service.text,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAssets.get(service.image),
      },
      alt: service.alt,
    },
    ...(service.ratio ? {imageRatio: service.ratio} : {}),
    ...(service.pos ? {imagePosition: service.pos} : {}),
    order: index + 1,
  })

  console.log(`Imported: ${service.name}`)
}

console.log(`\nSuccessfully imported ${services.length} services.`)
