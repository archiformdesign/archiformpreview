import CmsImage from '@/components/CmsImage';
import Arrow from '@/components/Arrow';
import EmphasisTail from '@/components/EmphasisTail';
import PageCta from '@/components/PageCta';
import PressClip from './PressClip';
import { pageMeta } from '@/lib/seo';
import { sanityFetch } from '@/sanity/lib/fetch';
import { JOURNAL_QUERY } from '@/sanity/lib/queries';
import { sanityImage } from '@/sanity/lib/image';

// Rebuild the page in the background at most once a minute, so Studio edits appear without a redeploy
export const revalidate = 60;

export const metadata = pageMeta({
  title: 'Journal',
  description: 'ARCHIFORM in the press: founder Roula Jbour in conversation with She Means Business, published by Gulf News, on designing healthier homes in Dubai.',
  path: '/journal',
  image: { url: '/m/she-means-business-p14.jpg', width: 1482, height: 1061, alt: 'Interview with Roula Jbour in She Means Business, Gulf News' },
});

/* The She Means Business feature (Gulf News, 30 October 2026, page 14). Its short film (PressClip) is a local file made from
   this printed feature, so it shows with this article only. */
const SHE_MEANS_BUSINESS_ID = 'journal-she-means-business-roula-jbour';

// publishedAt is a plain date (YYYY-MM-DD); format it in UTC so the day never shifts with the server's time zone
function formatDate(date, weekday) {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00Z`);
  const day = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return weekday ? `${d.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' })}, ${day}` : day;
}

export default async function JournalPage() {
  const articles = await sanityFetch(JOURNAL_QUERY);

  return (
    <>
      <main className="page jr-page" id="journal">
        <header className="pg-ttl jr-ttl">
          <p className="lbl rule">JOURNAL</p>
          <h1 className="disp">In the press.</h1>
          <p className="body">Conversations about design, wellbeing and the homes we create.</p>
        </header>

        {articles.map((a, i) => {
          const titleId = i === 0 ? 'jrTitle' : `jrTitle-${a.slug || i}`;
          const image = sanityImage(a.coverImage);
          const source = [a.publication, a.publisher].filter(Boolean).join(', ');
          const caption = [a.publication, a.publisher, a.pageReference, formatDate(a.publishedAt, true)].filter(Boolean).join(' · ');
          const link = (children, props) => (a.externalUrl ? <a href={a.externalUrl} target="_blank" rel="noopener noreferrer" {...props}>{children}</a> : children);
          return (
            <article className="jr-art" aria-labelledby={titleId} key={a._id}>
              <div className="jr-meta">
                {a.publication ? <span className="lbl">{a.publication}</span> : null}
                {a.publisher ? <span className="lbl">Published by {a.publisher}</span> : null}
                {a.publishedAt ? <span className="lbl">{formatDate(a.publishedAt)}</span> : null}
              </div>
              <h2 className="h2" id={titleId}><EmphasisTail text={a.title} tail="supportive of healthier living." /></h2>

              {image ? (
                <figure className="jr-clip">
                  {link(
                    <CmsImage src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 820px) 100vw, 88vw"
                      loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} />,
                    { 'aria-label': `Read the article${source ? ` in ${source}` : ''} (opens in a new tab)` },
                  )}
                  <figcaption className="lbl">{caption} {a.externalUrl ? <a className="jr-full" href={a.externalUrl} target="_blank" rel="noopener noreferrer">Read the article<span className="sr"> (opens in a new tab)</span> <Arrow /></a> : null}</figcaption>
                </figure>
              ) : null}

              <div className="jr-body">
                {a._id === SHE_MEANS_BUSINESS_ID ? <figure className="jr-vid"><PressClip /></figure> : null}
                {a.excerpt ? <p className="jr-lede">{a.excerpt}</p> : null}
              </div>
            </article>
          );
        })}
      </main>
      <PageCta />
    </>
  );
}
