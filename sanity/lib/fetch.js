import { cookies, draftMode } from 'next/headers'
import { resolvePerspectiveFromCookies } from 'next-sanity/live'

import { client } from './client'
import { readToken } from './token'

/**
 * Fetch from Sanity for a page.
 * - Normal visitors get published content, cached and refreshed by each page's `revalidate` (unchanged from client.fetch).
 * - In Draft Mode (an editor previewing from the Studio) it reads drafts with the read token, skips every cache, and
 *   adds the invisible markers that power click-to-edit overlays.
 */
export async function sanityFetch(query, params = {}) {
  const { isEnabled } = await draftMode()
  if (!isEnabled || !readToken) return client.fetch(query, params)

  // The Presentation tool's perspective switcher (drafts, published, a release) is passed along in a cookie
  const perspective = (await resolvePerspectiveFromCookies({ cookies: await cookies() })) ?? 'drafts'
  try {
    return await client.fetch(query, params, {
      token: readToken,
      perspective,
      useCdn: false,
      stega: true,
      cache: 'no-store',
    })
  } catch (error) {
    // @sanity/client errors carry the full request options, token included, and Next.js logs thrown errors in full.
    // Rethrow without them so a CMS outage during preview can never write the read token into the server logs.
    const status = typeof error?.statusCode === 'number' ? ` (HTTP ${error.statusCode})` : ''
    throw new Error(`Sanity draft preview request failed${status}${error?.isNetworkError ? ': network error' : ''}`)
  }
}
