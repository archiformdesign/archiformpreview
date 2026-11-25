import { site } from '@/content/site';
import { client } from '@/sanity/lib/client';
import { PROJECT_SLUGS_QUERY } from '@/sanity/lib/queries';

// Project pages come from the CMS, so the sitemap is refreshed hourly to pick up projects added in the Studio
export const revalidate = 3600;

export default async function sitemap() {
  const slugs = await client.fetch(PROJECT_SLUGS_QUERY);
  const now = new Date();
  const pages = ['', '/founder', '/portfolio', '/services', '/journal', '/contact'].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : 0.8,
  }));
  const work = slugs.map((slug) => ({
    url: `${site.url}/portfolio/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));
  return [...pages, ...work];
}
