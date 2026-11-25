'use client';

import Image from 'next/image';

const SANITY_CDN = 'https://cdn.sanity.io/';

/* Sanity's image CDN resizes and converts each image itself (w, q; auto=format serves WebP/AVIF; fit=max never enlarges),
   so CMS images skip the Next.js optimizer: the website's server never has to fetch images from another host. */
function sanityLoader({ src, width, quality }) {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality || 75));
  url.searchParams.set('fit', 'max');
  url.searchParams.set('auto', 'format');
  return url.toString();
}

/** next/image for CMS content: Sanity CDN images use Sanity's resizing; any other src (e.g. a local fallback) is unchanged */
export default function CmsImage(props) {
  const fromSanity = typeof props.src === 'string' && props.src.startsWith(SANITY_CDN);
  return <Image {...props} loader={fromSanity ? sanityLoader : undefined} />;
}
