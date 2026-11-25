import { stegaClean } from '@sanity/client/stega';

/**
 * Renders CMS heading text with the design's italic ending, e.g. "A more thoughtful way to <em>create home.</em>".
 * The ending is only italicised while the text still ends with it; if an editor rewrites the heading, it shows as plain text.
 * In Draft Mode the text carries invisible click-to-edit markers at its end: they are set aside for the comparison and put
 * back after the italic ending, so the heading stays clickable in the Studio preview.
 */
export default function EmphasisTail({ text, tail }) {
  if (!text) return null;
  const clean = stegaClean(text);
  const markers = text.startsWith(clean) ? text.slice(clean.length) : '';
  if (!tail || !clean.endsWith(tail) || clean === tail) return text;
  return <>{clean.slice(0, -tail.length)}<em>{tail}</em>{markers}</>;
}
