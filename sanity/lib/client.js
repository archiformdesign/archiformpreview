import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/* Fields whose text the site compares, parses or puts into links/CSS, so Draft Mode must never add the invisible
   click-to-edit markers to them. Sanity's default filter already skips slugs, URLs, dates, email and the like. */
const STEGA_SKIP = new Set([
  'alt',
  'category',
  'imageRatio',
  'imagePosition',
  'phones',
  'whatsapp',
  'instagram',
  'rail',
  'founderRole',
])

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  // Off for the public site; sanity/lib/fetch.js turns it on only for Draft Mode requests
  stega: {
    enabled: false,
    studioUrl: '/studio',
    filter: (props) => !props.sourcePath.some((segment) => STEGA_SKIP.has(segment)) && props.filterDefault(props),
  },
})
