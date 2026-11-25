import PageCta from '@/components/PageCta';
import ProjectGrid from './ProjectGrid';
import { pageMeta } from '@/lib/seo';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PROJECTS_QUERY } from '@/sanity/lib/queries';
import { sanityImage } from '@/sanity/lib/image';

// Rebuild the page in the background at most once a minute, so Studio edits appear without a redeploy
export const revalidate = 60;

export const metadata = pageMeta({
  title: 'Interior Design Portfolio',
  description: 'Villa and apartment interiors, renovations and bespoke joinery by ARCHIFORM in Dubai: bedrooms, bathrooms, kitchens, dining rooms and outdoor spaces.',
  path: '/portfolio',
});

export default async function PortfolioPage() {
  const docs = await sanityFetch(PROJECTS_QUERY);
  // Resolve image URLs and sizes here on the server, so the client grid receives plain data
  const projects = docs.map((p) => ({
    slug: p.slug,
    category: p.category,
    name: p.title,
    sub: p.subtitle,
    cover: sanityImage(p.coverImage, p.coverAlt ?? p.coverImage?.alt ?? ''),
  }));

  return (
    <>
    <main className="page pf-page" id="portfolio">
      <div className="pg-ttl pf-ttl">
        <p className="lbl rule">OUR PROJECTS</p>
        <h1 className="disp">Beautifully considered. Personally lived.</h1>
        <p className="body">Homes shaped by refined materials, layered textures and thoughtful details, each as individual as the people who live there.</p>
      </div>
      <ProjectGrid projects={projects} />
    </main>
    <PageCta />
    </>
  );
}
