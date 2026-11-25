import ContactForm from '@/components/ContactForm';
import { site } from '@/content/site';
import { pageMeta } from '@/lib/seo';
import { sanityFetch } from '@/sanity/lib/fetch';
import { CONTACT_PAGE_QUERY } from '@/sanity/lib/queries';

// Rebuild the page in the background at most once a minute, so Studio edits appear without a redeploy
export const revalidate = 60;

export const metadata = pageMeta({
  title: 'Contact',
  description: 'Book an initial consultation with ARCHIFORM, a Dubai interior design studio for villas and apartments. Tell us about your space and we will reply by email.',
  path: '/contact',
});

export default async function ContactPage() {
  // Contact details are edited in the Studio (Contact Us); any field left empty there falls back to content/site.js.
  // The enquiry form and its email delivery (/api/contact, Resend) do not use the CMS.
  const cms = (await sanityFetch(CONTACT_PAGE_QUERY)) || {};
  const email = cms.email || site.email;
  const phones = cms.phones?.filter(Boolean).length ? cms.phones.filter(Boolean) : [site.phone].filter(Boolean);
  const whatsapp = cms.whatsapp || site.whatsapp;
  const instagram = cms.instagram || site.instagram;
  const address = { ...site.address, ...Object.fromEntries(Object.entries(cms.address || {}).filter(([, v]) => v)) };
  const hours = cms.hours || site.hours;

  return (
    <main className="page ct-page" id="contact">
      <div className="pg-ttl ct-ttl">
        <p className="lbl">{cms.eyebrow || "LET'S CREATE YOUR SPACE"}</p>
        <h1 className="disp">{cms.heading || 'A beautiful home begins with a conversation.'}</h1>
      </div>
      <div className="ct">
        <div className="l">
          <p className="body">{cms.introduction || "Whether you're planning a villa renovation or refreshing a single room, tell us about your space and the home you imagine."}</p>
          <div className="info">
            <div><span className="lbl">Email</span><a className="sel" href={`mailto:${email}`} style={{ textDecoration: 'none' }}>{email}</a></div>
            {phones.length ? (
              <div><span className="lbl">Phone</span>{phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} style={{ textDecoration: 'none' }}>{phone}</a>)}</div>
            ) : null}
            {whatsapp ? (
              <div>
                <span className="lbl">WhatsApp</span>
                <a className="ct-wa" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.46A11.3 11.3 0 0 0 12.05.72C5.79.72.69 5.81.69 12.08c0 2 .52 3.96 1.52 5.68L.6 23.64l6.02-1.58a11.3 11.3 0 0 0 5.43 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.04z"/></svg>
                  {phones[0] || `+${whatsapp}`}<span className="sr"> (opens WhatsApp in a new tab)</span>
                </a>
              </div>
            ) : null}
            {instagram ? (
              <div><span className="lbl">Instagram</span><a href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>@{instagram}</a></div>
            ) : null}
            <div>
              <span className="lbl">Studio</span>
              {address.street ? <span>{address.street}</span> : null}
              <span>{address.city}, UAE</span>
              <span>{hours}</span>
            </div>
          </div>
        </div>
        <div className="r">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
