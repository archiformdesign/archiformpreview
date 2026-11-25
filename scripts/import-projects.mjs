import nextEnv from '@next/env'
const {loadEnvConfig} = nextEnv



import {createClient} from '@sanity/client'
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {projects} from '../content/projects.js'

loadEnvConfig(process.cwd())

const {NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN} = process.env

if (!NEXT_PUBLIC_SANITY_PROJECT_ID || !NEXT_PUBLIC_SANITY_DATASET || !SANITY_API_WRITE_TOKEN) {
  throw new Error('Missing Sanity project configuration or write token.')
}

const client = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-11-21',
  token: SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const allImages = new Set()

for (const project of projects) {
  if (!project.slug || !project.name || !project.cover) {
    throw new Error(`Project is missing required data: ${project.name || 'Unknown project'}`)
  }

  allImages.add(project.cover)

  for (const image of project.images || []) {
    allImages.add(image.src)
  }
}

const missingImages = [...allImages].filter(src =>
  !existsSync(path.join(process.cwd(), 'public', src.replace(/^\/+/, '')))
)

if (missingImages.length) {
  throw new Error(`Missing image files:\n${missingImages.join('\n')}`)
}

console.log(`Validated ${projects.length} projects and ${allImages.size} unique images.`)

const uploadedAssets = new Map()

async function uploadImage(src) {
  if (uploadedAssets.has(src)) return uploadedAssets.get(src)

  const filePath = path.join(process.cwd(), 'public', src.replace(/^\/+/, ''))

  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })

  uploadedAssets.set(src, asset._id)
  console.log(`Uploaded: ${src}`)

  return asset._id
}

for (const src of allImages) {
  await uploadImage(src)
}

for (const project of projects) {
  const gallery = await Promise.all(
    (project.images || []).map(async (image, index) => ({
      _key: `image-${index + 1}`,
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: uploadedAssets.get(image.src),
      },
      ...(image.alt ? {alt: image.alt} : {}),
      ...(image.wide !== undefined ? {wide: image.wide} : {}),
      ...(image.full !== undefined ? {full: image.full} : {}),
      ...(image.kind ? {kind: image.kind} : {}),
    }))
  )

  const document = {
    _id: `project-${project.slug}`,
    _type: 'project',
    title: project.name,
    slug: {
      _type: 'slug',
      current: project.slug,
    },
    category: project.category,
    ...(project.sub ? {subtitle: project.sub} : {}),
    ...(project.type ? {projectType: project.type} : {}),
    ...(project.location ? {location: project.location} : {}),
    ...(project.did ? {servicesProvided: Array.isArray(project.did) ? project.did.join(', ') : project.did} : {}),
    ...(project.intro ? {introduction: project.intro} : {}),
    ...(project.text ? {description: project.text} : {}),
    coverImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: uploadedAssets.get(project.cover),
      },
    },
    gallery,
    featured: false,
  }

  await client.createOrReplace(document)
  console.log(`Imported project: ${project.name}`)
}

console.log(`\nImport complete: ${projects.length} projects imported.`)
