import Link from 'next/link';
import Faq from './Faq';
import ServiceList from './ServiceList';
import PageCta from '@/components/PageCta';
import { pageMeta } from '@/lib/seo';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SERVICES_QUERY } from '@/sanity/lib/queries';
import { imagePosition, sanityImage } from '@/sanity/lib/image';

// Rebuild the page in the background at most once a minute, so Studio edits appear without a redeploy
export const revalidate = 60;

export const metadata = pageMeta({
  title: 'Interior Design Services in Dubai',
  description: 'Interior design and space planning, villa and apartment renovation, bespoke joinery, furnishing and project management in Dubai, with healthy-home thinking at every stage.',
  path: '/services',
});

export default async function ServicesPage() {
  const docs = await sanityFetch(SERVICES_QUERY);
  // Same shape ServiceList has always used, with the image resolved to a Sanity CDN URL and its size
  const services = docs.map((s) => ({
    name: s.title,
    rail: s.rail,
    tagline: s.tagline,
    text: s.description,
    image: sanityImage(s.image),
    ratio: s.imageRatio,
    pos: s.imagePosition || imagePosition(s.image),
  }));

  return (
    <>
    <main className="page sv-page" id="services">
      <div className="sv-wrap">
        <div className="pg-ttl sv-ttl">
          <p className="lbl">WHAT WE DO</p>
          <h1 className="disp">Every detail considered. Every space thoughtfully created.</h1>
          <p className="body">From refreshing a single room to a complete home transformation, we guide you through each stage with care, clarity and attention to detail.</p>
        </div>
        <ServiceList services={services} />
      </div>
      <div className="page-cta">
        <Link className="btn" href="/contact">DISCUSS YOUR PROJECT →</Link>
      </div>
      <Faq />
    </main>
    <PageCta />
    </>
  );
}
