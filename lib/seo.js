import { site } from '@/content/site';

/* The link preview image (WhatsApp, iMessage, LinkedIn, Facebook, X) for every page without one of its own: a finished ARCHIFORM
   project, the Bespoke Joinery dressing wall (public/m/pf/joinery-dressing-wall.jpg), cropped to 1200x630 and kept under 300 KB,
   which WhatsApp needs to show a large preview. A new image needs a new file name: Hostinger lets browsers and apps keep files in public/ for a year. */
export const ogImage = {
  url: '/og-archiform.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'A bespoke dressing wall by ARCHIFORM: a curved wardrobe with a bronze inlay, a wave-fronted chest of drawers and a backlit arched mirror',
};

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
