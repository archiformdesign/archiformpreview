import { site } from '@/content/site';

export const ogImage = { url: '/og.jpg', width: 1200, height: 630, alt: 'The arched entrance of an ARCHIFORM home' };

/** Search results show about 155 characters of a description; longer ones (CMS project text, say) end at a word, with an ellipsis */
export function clampDescription(text, max = 155) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : cut.length).replace(/[\s,;:.\-–—]+$/, '') + '…';
}

/**
 * Page metadata with a canonical URL and matching Open Graph tags. Next.js replaces (not merges) a parent's
 * openGraph object, so every page builds the full set here instead of relying on the root layout.
 */
export function pageMeta({ title, description: full, path, image }) {
  const description = clampDescription(full);
  return {
    // Leave title out when not given, so the root layout's default title applies
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_AE',
      url: path,
      title: title ? `${title} | ${site.name}` : `${site.name} | ${site.titleTail}`,
      description,
      images: [image || ogImage],
    },
  };
}
