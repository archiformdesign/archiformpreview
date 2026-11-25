/**
 * Creates the Home Page singleton (_id "homePage") from the site's existing home page copy in content/home.js.
 * Uses createIfNotExists: once the document exists (and may have been edited in the Studio) this script changes nothing.
 * Images are uploaded once each; Sanity stores identical files as one asset, so images already uploaded for projects or
 * About Us are reused rather than duplicated. An image's crop position (pos) becomes its hotspot, editable in the Studio.
 *
 * Uses SANITY_API_WRITE_TOKEN from .env.local (server-side only; never printed).
 * Run: node scripts/import-home.mjs
 */
import nextEnv from '@next/env'
import {createClient} from '@sanity/client'
import {createReadStream, existsSync} from 'node:fs'
import path from 'node:path'
import {home} from '../content/home.js'

const {loadEnvConfig} = nextEnv
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

const existing = await client.getDocument('homePage')
if (existing) {
  console.log('homePage already exists; nothing changed.')
  process.exit(0)
}

const images = [home.founderImage, ...home.detailCards.map((c) => c.image), ...home.journey.map((j) => j.image)]
const missing = images.filter((im) => !existsSync(path.join(process.cwd(), 'public', im.src)))
if (missing.length) throw new Error(`Missing image files:\n${missing.map((im) => im.src).join('\n')}`)

const assets = new Map()
for (const {src} of images) {
  if (assets.has(src)) continue
  const asset = await client.assets.upload('image', createReadStream(path.join(process.cwd(), 'public', src)), {filename: path.basename(src)})
  assets.set(src, asset._id)
  console.log(`Image ready: ${src}`)
}

function imageField(im) {
  const field = {_type: 'image', asset: {_type: 'reference', _ref: assets.get(im.src)}, alt: im.alt}
  const pos = im.pos?.match(/^([\d.]+)% ([\d.]+)%$/)
  if (pos) {
    field.hotspot = {_type: 'sanity.imageHotspot', x: Number(pos[1]) / 100, y: Number(pos[2]) / 100, width: 1, height: 1}
    field.crop = {_type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0}
  }
  return field
}

const keyed = (list, prefix, map) => list.map((item, i) => ({_key: `${prefix}-${i + 1}`, ...map(item)}))

await client.createIfNotExists({
  _id: 'homePage',
  _type: 'homePage',
  heroIntro: home.heroIntro,
  heroValues: home.heroValues,
  walkInLabel: home.walkInLabel,
  walkInHeading: home.walkInHeading,
  walkInText: home.walkInText,
  panels: keyed(home.panels, 'panel', (p) => ({_type: 'panel', title: p.title, text: p.text})),
  holisticLabel: home.holisticLabel,
  holisticHeading: home.holisticHeading,
  holisticText: home.holisticText,
  detailsLabel: home.detailsLabel,
  detailsHeading: home.detailsHeading,
  detailsText: home.detailsText,
  detailCards: keyed(home.detailCards, 'card', (c) => ({_type: 'detailCard', image: imageField(c.image), title: c.title, subtitle: c.subtitle, points: c.points})),
  featuredSubtitle: home.featuredSubtitle,
  featuredText: home.featuredText,
  featuredQuote: home.featuredQuote,
  processHeading: home.processHeading,
  processSteps: keyed(home.processSteps, 'step', (s) => ({_type: 'step', title: s.title, text: s.text})),
  founderLabel: home.founderLabel,
  founderHeading: home.founderHeading,
  founderText: home.founderText,
  founderQuote: home.founderQuote,
  founderSignature: home.founderSignature,
  founderImage: imageField(home.founderImage),
  journeyHeading: home.journeyHeading,
  journey: keyed(home.journey, 'journey', (j) => ({_type: 'journeyStep', label: j.label, image: imageField(j.image)})),
  closeLabel: home.closeLabel,
  closeHeading: home.closeHeading,
  closeParagraphs: home.closeParagraphs,
  closeCta: home.closeCta,
})

console.log('Home Page imported successfully.')
