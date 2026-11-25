import { cache } from 'react';
import CmsImage from '@/components/CmsImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Arrow from '@/components/Arrow';
import { site } from '@/content/site';
import { pageMeta } from '@/lib/seo';
import { jsonLd } from '@/lib/json-ld';
import { client } from '@/sanity/lib/client';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from '@/sanity/lib/queries';
import { imagePosition, sanityImage } from '@/sanity/lib/image';

// Rebuild in the background at most once a minute; a project added in the Studio after the build renders on first visit
export const revalidate = 60;

// One fetch per request, shared by generateMetadata and the page
const getProject = cache((slug) => sanityFetch(PROJECT_QUERY, { slug }));

// Build time only (no request, so no Draft Mode): the published projects
export async function generateStaticParams() {
  const slugs = await client.fetch(PROJECT_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  const cover = sanityImage(p.coverImage, p.coverAlt || p.title);
  return pageMeta({
    title: [p.title, p.location].filter(Boolean).join(', '),
    description: [p.introduction, p.projectType && `${p.projectType} by ARCHIFORM${p.servicesProvided ? `: ${p.servicesProvided.toLowerCase()}` : ''}.`].filter(Boolean).join(' '),
    path: `/portfolio/${p.slug}`,
    ...(cover ? { image: { url: cover.src, width: cover.width, height: cover.height, alt: cover.alt } } : {}),
  });
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const images = (p.gallery || []).map((img) => ({ ...img, image: sanityImage(img), pos: imagePosition(img) })).filter((img) => img.image);
  const next = p.next;
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${site.url}/portfolio` },
      { '@type': 'ListItem', position: 3, name: p.title, item: `${site.url}/portfolio/${p.slug}` },
    ],
  };
  return (
    <main className="page" id="project">
      <div className="pj-head">
        <div className="l">
          <p className="lbl rule">{[p.projectType, p.location].filter(Boolean).join(' · ')}</p>
          <h1 className="disp">{p.title}</h1>
          <p className="lbl">{p.subtitle}</p>
        </div>
        <div className="r">
          <p className="intro">{p.introduction}</p>
          <p className="body">{p.description}</p>
        </div>
      </div>
      <div className="pj-imgs">
        {images.map((img, i) => {
          // A half-width image left alone on the last row is centred rather than leaving an empty column beside it
          const col = images.slice(0, i).reduce((c, im) => (im.wide ? 0 : (c + 1) % 2), 0);
          const solo = !img.wide && col === 0 && i === images.length - 1;
          return (
            <figure key={img._key || i} className={[img.wide && 'w', img.full && 'f', solo && 'solo'].filter(Boolean).join(' ') || undefined}>
              <CmsImage src={img.image.src} alt={img.image.alt} width={img.image.width} height={img.image.height} style={img.pos ? { objectPosition: img.pos } : undefined}
                sizes={img.wide ? '(max-width: 820px) 92vw, 88vw' : '(max-width: 820px) 46vw, 44vw'}
                loading={i < 2 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} />
            </figure>
          );
        })}
      </div>
      <div className="pj-meta">
        <div><span className="lbl">Location</span><span>{p.location}</span></div>
        <div><span className="lbl">Type</span><span>{p.projectType}</span></div>
        <div style={{ gridColumn: 'span 2' }}><span className="lbl">What we did</span><span>{p.servicesProvided}</span></div>
      </div>
      <div className="pj-next">
        <Link className="go" href="/portfolio">All projects <Arrow /></Link>
        {next ? <Link className="n" href={`/portfolio/${next.slug}`}><span className="sr">Next project: </span>{next.title} <Arrow /></Link> : null}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
    </main>
  );
}
