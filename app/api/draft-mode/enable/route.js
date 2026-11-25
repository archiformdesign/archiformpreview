import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { client } from '@/sanity/lib/client'
import { readToken } from '@/sanity/lib/token'

/* Opened by the Studio's Presentation tool. It checks the one-time secret the Studio wrote to the dataset (so no one can
   turn on Draft Mode by guessing this URL), sets the Draft Mode cookie and redirects to the page being previewed. */
const enable = defineEnableDraftMode({ client: client.withConfig({ token: readToken }) })

export async function GET(request) {
  if (!readToken) {
    // The detail goes to the server log only; visitors get a generic message
    console.error('Draft mode: SANITY_API_READ_TOKEN is not set, so preview is unavailable.')
    return new Response('Preview is not available.', { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
  return enable.GET(request)
}
