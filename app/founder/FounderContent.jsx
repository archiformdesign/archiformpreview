import CmsImage from '@/components/CmsImage';
import { PortableText } from 'next-sanity';
import EmphasisTail from '@/components/EmphasisTail';
import PageCta from '@/components/PageCta';
import { imagePosition, sanityImage } from '@/sanity/lib/image';

// Portable Text paragraphs keep the page's body style; other block styles fall back to the same paragraph
const bodyText = { block: { normal: ({ children }) => <p className="body">{children}</p> }, unknownBlockStyle: ({ children }) => <p className="body">{children}</p> };

// The pillar icons belong to the design, in the order of the four principles
const PILLAR_ICONS = [
  <svg key="0" viewBox="0 0 70 104" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><use href="#sprig"/></svg>,
  <svg key="1" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><path d="M5 19 20 5l15 14v16H5z"/></svg>,
  <svg key="2" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><circle cx="15" cy="20" r="11"/><circle cx="25" cy="20" r="11"/></svg>,
  <svg key="3" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true"><circle cx="20" cy="20" r="7"/><path d="M20 3v6M20 31v6M3 20h6M31 20h6M8 8l4.2 4.2M27.8 27.8 32 32M8 32l4.2-4.2M27.8 12.2 32 8"/></svg>,
];

/* About Us: the founder beside her portrait, the approach beside the sunset living room, the studio on olive, then the invitation.
   about is the aboutPage singleton from Sanity. */
export default function FounderContent({ about }) {
  const portrait = sanityImage(about.founderImage);
  const approach = sanityImage(about.approachImage);
  // The role under the name drops the studio name that the signature carries ("Founder & Interior Designer, ARCHIFORM")
  const role = about.founderRole?.replace(/,\s*ARCHIFORM\s*$/i, '');
  return (
    <main id="founder">
      <section className="ab-hero">
        <div className="tx">
          <h1 className="lbl">{about.title || 'About Us'}</h1>
          <h2 className="nm">{about.founderName}</h2>
          {role ? <p className="lbl rule">{role}</p> : null}
          <p className="it tag">Designing spaces that care for the people within them.</p>
          {about.introduction ? <PortableText value={about.introduction} components={bodyText} /> : null}
          <p className="it sig">- {about.founderName}{about.founderRole ? <><br />{about.founderRole}</> : null}</p>
        </div>
        <div className="ph">
          {portrait ? <CmsImage src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} sizes="(max-width: 900px) 100vw, 54vw" loading="eager" fetchPriority="high" style={about.founderImage.hotspot ? { objectPosition: imagePosition(about.founderImage) } : undefined} /> : null}
          <p className="words"><span>Design</span><span>People</span><span>Wellbeing</span><span>Balance</span></p>
        </div>
      </section>

      <section className="ab-approach" id="philosophy">
        <div className="qp">{approach ? <CmsImage src={approach.src} alt={approach.alt} width={approach.width} height={approach.height} sizes="(max-width: 900px) 100vw, 50vw" style={{objectPosition: imagePosition(about.approachImage, '55% 62%')}} /> : null}<p>“A home should feel like you.”</p></div>
        <div className="tx">
          <p className="lbl rule">ARCHIFORM Approach</p>
          <h2 className="h2">{about.approachHeading}</h2>
          {about.approachText ? <p className="body">{about.approachText}</p> : null}
          <div className="pillars" id="design-principles">
            {(about.pillars || []).map((pillar, i) => (
              <div key={pillar._key || i}>{PILLAR_ICONS[i % PILLAR_ICONS.length]}<span className="lbl">{pillar.title}</span><span className="it">{pillar.text}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-studio" id="about-archiform" aria-labelledby="aboutTitle">
        <p className="lbl rule">ABOUT ARCHIFORM</p>
        <div className="r">
          <h2 className="h2" id="aboutTitle"><EmphasisTail text={about.studioHeading} tail="create home." /></h2>
          <div className="cols">
            {about.studioDescription ? <PortableText value={about.studioDescription} components={bodyText} /> : null}
          </div>
        </div>
      </section>

      <PageCta />
    </main>
  );
}
