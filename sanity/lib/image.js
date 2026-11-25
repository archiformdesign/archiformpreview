import { createImageUrlBuilder } from '@sanity/image-url';
import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

/** URL builder for a Sanity image field (an object with asset._ref). Chain .width(), .url() etc. */
export function urlFor(source) {
  return builder.image(source);
}

/**
 * Pixel size of a Sanity image, read from its asset reference (image-<id>-<w>x<h>-<ext>), so no extra asset query is
 * needed. When an editor has cropped the image in the Studio, the cropped size is returned, matching what urlFor serves.
 */
export function imageDimensions(source, fallback = [1600, 1200]) {
  const match = source?.asset?._ref?.match(/-(\d+)x(\d+)-[a-z]+$/);
  if (!match) return fallback;
  let [width, height] = [Number(match[1]), Number(match[2])];
  const crop = source.crop;
  if (crop) {
    width = Math.round(width * (1 - (crop.left || 0) - (crop.right || 0)));
    height = Math.round(height * (1 - (crop.top || 0) - (crop.bottom || 0)));
  }
  return [width, height];
}

/** CSS object-position from the image's Studio hotspot, or the given fallback when no hotspot is set */
export function imagePosition(source, fallback) {
  const h = source?.hotspot;
  if (h && typeof h.x === 'number' && typeof h.y === 'number') return `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%`;
  return fallback;
}

/**
 * Everything next/image needs for a Sanity image: { src, alt, width, height }. src is the full-size CDN image; next/image
 * resizes it and serves AVIF/WebP. Returns null when the field has no asset, so a missing image never crashes a page.
 */
export function sanityImage(source, alt) {
  if (!source?.asset?._ref) return null;
  const [width, height] = imageDimensions(source);
  return { src: urlFor(source).url(), alt: alt ?? source.alt ?? '', width, height };
}
