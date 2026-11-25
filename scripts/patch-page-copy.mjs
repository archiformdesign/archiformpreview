/**
 * One-off, targeted content fix after the initial import (Nov 2026). It patches only the fields listed below; it does not
 * re-import documents or upload assets. Safe to re-run: it sets the same values again.
 *
 *  - contactPage: the import used starter copy ("Get in touch") and only one phone number. These are set to the copy and
 *    both numbers shown on the live contact page (app/contact/page.js before the CMS integration).
 *  - journal (She Means Business): pageReference "Page 14", shown in the feature image caption, as on the original page.
 *
 * Uses SANITY_API_WRITE_TOKEN from .env.local (server-side only; never printed).
 * Run: node scripts/patch-page-copy.mjs
 */
import nextEnv from '@next/env'
import {createClient} from '@sanity/client'

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

const patches = [
  {
    id: 'contactPage',
    set: {
      heading: 'A beautiful home begins with a conversation.',
      introduction: "Whether you're planning a villa renovation or refreshing a single room, tell us about your space and the home you imagine.",
      phones: ['+971 50 182 1581', '+971 50 160 5312'],
    },
  },
  {
    id: 'journal-she-means-business-roula-jbour',
    set: {pageReference: 'Page 14'},
  },
]

for (const {id, set} of patches) {
  const fields = Object.keys(set)
  const before = await client.getDocument(id)
  if (!before) throw new Error(`Document not found: ${id} (nothing was changed)`)
  console.log(`\n${id}: before`, JSON.stringify(Object.fromEntries(fields.map((f) => [f, before[f] ?? null]))))
  const after = await client.patch(id).set(set).commit()
  console.log(`${id}: after `, JSON.stringify(Object.fromEntries(fields.map((f) => [f, after[f] ?? null]))))
}

console.log('\nDone.')
